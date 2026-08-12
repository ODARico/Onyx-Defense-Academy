#!/usr/bin/env node
/* ============================================================================
   ONYX DEFENSE ACADEMY — USCCA class sync
   ============================================================================
   Runs once a day (see .github/workflows/sync-uscca-classes.yml). Checks the
   public USCCA instructor page for classes and, if it finds any dates that
   aren't already in schedule-data.js, opens a pull request adding them.

   HOW THIS WORKS (two steps, because of how USCCA structures the page):

   Step 1 — read the main instructor page ("Current Classes Available") to
   find every class you teach, its display name, price, and venue.

   Step 2 — visit EACH of those classes' own individual pages. This step
   exists because adding a second date to a class you already posted does
   NOT create a new row on the main instructor page -- it only shows up
   under "Upcoming Class Dates for [Class Name]" on that class's own page.
   Skipping this step would silently miss every additional date you add to
   an existing class, which is the whole reason this script visits each
   class page individually instead of only reading the summary page.

   A class's own page shows dates one of two ways depending on how many are
   scheduled:
     - Two or more dates: a list under "Upcoming Class Dates for [Name]",
       each with its own Register link.
     - Exactly one date: no such list -- just a single date/time/Register
       link near the top of the page.
   This script checks for the list first and only falls back to the
   single-date layout when that list isn't there.

   IMPORTANT DESIGN CHOICES — read before changing this file:

   1. This script NEVER edits or deletes an existing entry in schedule-data.js.
      It only ever adds new blocks at the end. A class you booked privately
      (not through USCCA) is never touched, because this script doesn't know
      it exists and doesn't need to. Likewise, if you change a date's time
      or price on USCCA after it's already on your site, this script will
      NOT update it -- that still has to be edited by hand.

   2. Each specific date is matched to your site by its own unique USCCA
      "Register" URL (not the class's general info-page URL, and not its
      name) -- so two different dates for the same class are always
      recognized as two different things, and re-running this never creates
      duplicates.

   3. This script does not commit directly to your live site. It writes to
      schedule-data.js, and the GitHub Actions workflow around it opens a
      pull request instead of merging automatically. You approve every
      change with one click before it goes live. This is intentional --
      this script was written without the ability to test it against the
      real, live USCCA page, so a human check before anything goes live is
      the safety net.

   4. If anything about a page looks different than expected -- USCCA
      redesigns it, a date/name can't be confidently read, etc. -- this
      script skips that item rather than guessing. A missing entry is
      always safer than a wrong one.

   5. Classes are matched to your site's classType by the exact name shown
      on USCCA's main instructor page. If a class's title there should show
      up under a DIFFERENT name on your site, add that translation to
      NAME_MAP below.
   ============================================================================ */

const fs = require("fs");
const path = require("path");

const INSTRUCTOR_URL =
  "https://www.usconcealedcarry.com/firearms-training/instructors/north-carolina-instructors/onyx-defense-academy-llc-3016131/";
const SCHEDULE_FILE = path.join(__dirname, "..", "..", "schedule-data.js");

// If a class's title on USCCA should show up under a DIFFERENT name on your
// site, add it here: "Exact USCCA title": "Exact site classType".
const NAME_MAP = {};

async function main() {
  console.log("Step 1 — checking the main instructor page:", INSTRUCTOR_URL);

  const indexHtml = await safeFetch(INSTRUCTOR_URL);
  if (indexHtml === null) return;

  const classPages = parseClassPages(indexHtml);
  if (classPages === null) {
    console.log("Main page structure looked unexpected. Exiting without changes.");
    return;
  }
  console.log(`Found ${classPages.length} class(es) on the main page.`);
  if (classPages.length === 0) return;

  console.log("Step 2 — visiting each class's own page to check for all scheduled dates...");
  const allSessions = [];
  for (const cp of classPages) {
    const detailHtml = await safeFetch(cp.url);
    if (detailHtml === null) {
      console.log(`  Skipping "${cp.classType}" -- couldn't load its page.`);
      continue;
    }
    const sessions = parseSessions(detailHtml);
    if (sessions === null || sessions.length === 0) {
      console.log(`  "${cp.classType}": no confidently-readable dates found, skipping.`);
      continue;
    }
    console.log(`  "${cp.classType}": ${sessions.length} date(s) currently listed.`);
    for (const s of sessions) {
      allSessions.push({
        classType: cp.classType,
        location: cp.location,
        date: s.date,
        time: s.time,
        registerUrl: s.registerUrl
      });
    }
  }

  if (!fs.existsSync(SCHEDULE_FILE)) {
    console.log("Could not find schedule-data.js at the expected path. Exiting without changes.");
    return;
  }
  const scheduleSource = fs.readFileSync(SCHEDULE_FILE, "utf8");
  const existingUrls = new Set(
    [...scheduleSource.matchAll(/registerUrl:\s*"([^"]+)"/g)].map((m) => m[1])
  );

  const newEntries = allSessions.filter((s) => s.registerUrl && !existingUrls.has(s.registerUrl));
  if (newEntries.length === 0) {
    console.log("Nothing new. No changes made.");
    return;
  }

  console.log(`Adding ${newEntries.length} new date(s):`);
  newEntries.forEach((s) => console.log(`  - ${s.classType} on ${s.date}`));

  const blocks = newEntries
    .map(
      (s) =>
        `  {\n` +
        `    classType: "${escapeJs(s.classType)}",\n` +
        `    date: "${s.date}",\n` +
        `    time: "${escapeJs(s.time)}",\n` +
        `    location: "${escapeJs(s.location)}",\n` +
        `    notes: "Added automatically from USCCA -- double-check details.",\n` +
        `    registerUrl: "${s.registerUrl}"\n` +
        `  },\n`
    )
    .join("");

  const marker = "\n];";
  const idx = scheduleSource.lastIndexOf(marker);
  if (idx === -1) {
    console.log("Could not find the closing '];' in schedule-data.js. Exiting without changes.");
    return;
  }
  const updated = scheduleSource.slice(0, idx) + "\n" + blocks + scheduleSource.slice(idx);
  fs.writeFileSync(SCHEDULE_FILE, updated, "utf8");
  console.log("schedule-data.js updated. The workflow will open a pull request with this change.");
}

async function safeFetch(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!res.ok) {
      console.log(`  ${url} returned ${res.status}.`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.log(`  Fetch failed for ${url}:`, err.message);
    return null;
  }
}

/**
 * STEP 1 parser. Reads the "Current Classes Available" section of the main
 * instructor page. Each class links to its own page, and that link appears
 * more than once nearby (for the date, the title, and "with") -- we only
 * need each class's page URL once, plus its name/venue, which we read from
 * a chunk of text strictly bounded by the previous and next class's link,
 * so one class's details can never bleed into another's.
 */
function parseClassPages(html) {
  const sectionStart = html.indexOf("Current Classes Available");
  if (sectionStart === -1) return null;

  const linkPattern =
    /href="(https:\/\/www\.usconcealedcarry\.com\/firearms-training\/instructors\/north-carolina-instructors\/onyx-defense-academy-llc-3016131\/class-[a-z0-9-]+\/)"/g;

  const section = html.slice(sectionStart);

  const firstSeenAt = [];
  const seen = new Set();
  let m;
  while ((m = linkPattern.exec(section)) !== null) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    firstSeenAt.push({ url: m[1], index: m.index });
  }
  if (firstSeenAt.length === 0) return [];

  const results = [];
  for (let i = 0; i < firstSeenAt.length; i++) {
    // No backward margin here on purpose: the title and venue for a class
    // always appear AFTER its own link in the markup, never before, so
    // starting exactly at the link avoids ever reading into the PREVIOUS
    // class's trailing text (which is what caused a real bug during
    // testing -- see commit history / testing notes).
    const startIdx = firstSeenAt[i].index;
    const endIdx = i + 1 < firstSeenAt.length ? firstSeenAt[i + 1].index : section.length;
    const chunk = stripTags(section.slice(startIdx, endIdx));

    const titleMatch = chunk.match(/\n\s*([A-Z][A-Za-z0-9&'.,\- ]{4,80})\s*\n/);
    const venueMatch = chunk.match(/\n\s*([A-Za-z0-9&'.,\- ]{4,60})\n\s*Autryville,\s*NC/);

    if (!titleMatch) continue; // don't guess a name -- skip this one

    const rawName = titleMatch[1].trim();
    results.push({
      url: firstSeenAt[i].url,
      classType: NAME_MAP[rawName] || rawName,
      location: venueMatch ? `${venueMatch[1].trim()}, Autryville, NC` : "Autryville, NC"
    });
  }
  return results;
}

/**
 * STEP 2 parser. Reads one class's own page and returns every currently
 * scheduled session as { date, time, registerUrl }. Looks inside the
 * multi-date list first ("Upcoming Class Dates for ..."), and falls back
 * to reading the whole page (which finds the single primary date/Register
 * block near the top) when that list isn't present.
 */
function parseSessions(html) {
  const registerPattern = /href="(https:\/\/checkout\.training\.usconcealedcarry\.com\/register\/[^"]+)"/g;

  const listStart = html.indexOf("Upcoming Class Dates for");
  const searchIn = listStart !== -1 ? html.slice(listStart) : html;

  // Find every Register link's position first, in order.
  const linkPositions = [];
  let m;
  while ((m = registerPattern.exec(searchIn)) !== null) {
    linkPositions.push({ url: m[1], index: m.index, matchLength: m[0].length });
  }
  if (linkPositions.length === 0) return [];

  // Bound each session's text strictly between consecutive Register links
  // (with a backward margin to catch the date/time before the first one),
  // so two sessions listed close together can never contaminate each other.
  const BACK_MARGIN = 200;
  const sessions = [];
  const seenUrls = new Set();

  for (let i = 0; i < linkPositions.length; i++) {
    const url = linkPositions[i].url;
    if (seenUrls.has(url)) continue; // same link can appear twice near one date (e.g. "Save My Seat" + "Register")
    seenUrls.add(url);

    // Never look back further than where the PREVIOUS session's own
    // Register link ended -- this is what actually prevents one session's
    // date from bleeding into a neighboring session, the same class of bug
    // that showed up (and got fixed) in Step 1's parser during testing.
    const prevLinkEnd = i > 0 ? linkPositions[i - 1].index + linkPositions[i - 1].matchLength : 0;
    const startIdx = Math.max(prevLinkEnd, linkPositions[i].index - BACK_MARGIN, 0);
    const chunk = stripTags(searchIn.slice(startIdx, linkPositions[i].index));

    const dateMatch = chunk.match(/([A-Z][a-z]{2},\s*[A-Z][a-z]{2}\.?\s*\d{1,2},\s*\d{4})/);
    const timeMatch = chunk.match(/(\d{1,2}:\d{2}\s*[AP]M)/);

    if (!dateMatch || !timeMatch) continue; // don't guess -- skip this one

    const isoDate = toIsoDate(dateMatch[1]);
    if (!isoDate) continue;

    sessions.push({
      date: isoDate,
      time: timeMatch[1].replace(/\s+/g, " ").trim(),
      registerUrl: url
    });
  }

  return sessions;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "\n");
}

function escapeJs(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function toIsoDate(text) {
  const months = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  const m = text.match(/([A-Za-z]{3})\.?\s*(\d{1,2}),\s*(\d{4})/);
  if (!m) return null;
  const mon = months[m[1].toLowerCase()];
  if (!mon) return null;
  const day = String(m[2]).padStart(2, "0");
  const monStr = String(mon).padStart(2, "0");
  return `${m[3]}-${monStr}-${day}`;
}

main().catch((err) => {
  console.error("Unexpected error, exiting without changes:", err.message);
});
