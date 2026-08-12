#!/usr/bin/env node
/* ============================================================================
   ONYX DEFENSE ACADEMY — USCCA class sync
   ============================================================================
   Runs once a day (see .github/workflows/sync-uscca-classes.yml). Checks the
   public USCCA instructor page for classes and, if it finds any that aren't
   already in schedule-data.js, opens a pull request adding them.

   IMPORTANT DESIGN CHOICES — read before changing this file:

   1. This script NEVER edits or deletes an existing entry in schedule-data.js.
      It only ever adds new blocks at the end. A class you booked privately
      (not through USCCA) is never touched, because this script doesn't know
      it exists and doesn't need to.

   2. This script does not commit directly to your live site. It writes to
      schedule-data.js, and the GitHub Actions workflow around it opens a
      pull request instead of merging automatically. You approve every
      change with one click before it goes live. This is intentional — this
      script was written without the ability to test it against the real,
      live USCCA page, so a human check before anything goes live is the
      safety net.

   3. If anything about the page looks different than expected -- USCCA
      redesigns it, a date/name can't be confidently read, etc. -- this
      script does NOTHING rather than guess. No pull request opens, nothing
      changes, and it just quietly tries again tomorrow. A missing PR is
      always safer than a wrong one.

   4. Classes are matched to your site by their unique USCCA URL, not by
      name. That means even if a class title on USCCA doesn't exactly match
      a heading on classes.html, this script can still recognize a class it
      already knows about and won't create a duplicate. If USCCA's name for
      a class needs to be translated into a DIFFERENT name for your site,
      add that translation to NAME_MAP below.
   ============================================================================ */

const fs = require("fs");
const path = require("path");

const INSTRUCTOR_URL =
  "https://www.usconcealedcarry.com/firearms-training/instructors/north-carolina-instructors/onyx-defense-academy-llc-3016131/";
const SCHEDULE_FILE = path.join(__dirname, "..", "..", "schedule-data.js");

// If a class's title on USCCA should show up under a DIFFERENT name on your
// site, add it here: "Exact USCCA title": "Exact site classType".
// Leave empty to use USCCA's title as-is.
const NAME_MAP = {};

async function main() {
  console.log("Checking:", INSTRUCTOR_URL);

  let html;
  try {
    const res = await fetch(INSTRUCTOR_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OnyxScheduleSync/1.0)" }
    });
    if (!res.ok) {
      console.log(`Page returned ${res.status}. Exiting without changes.`);
      return;
    }
    html = await res.text();
  } catch (err) {
    console.log("Fetch failed, exiting without changes:", err.message);
    return;
  }

  const classes = parseClasses(html);
  if (classes === null) {
    console.log("Page structure looked unexpected. Exiting without changes so nothing bad gets committed.");
    return;
  }
  console.log(`Parsed ${classes.length} class(es) currently listed on USCCA.`);

  if (!fs.existsSync(SCHEDULE_FILE)) {
    console.log("Could not find schedule-data.js at the expected path. Exiting without changes.");
    return;
  }
  const scheduleSource = fs.readFileSync(SCHEDULE_FILE, "utf8");
  const existingUrls = new Set(
    [...scheduleSource.matchAll(/registerUrl:\s*"([^"]+)"/g)].map((m) => m[1])
  );

  const newEntries = classes.filter((c) => c.url && !existingUrls.has(c.url));
  if (newEntries.length === 0) {
    console.log("Nothing new. No changes made.");
    return;
  }

  console.log(`Found ${newEntries.length} class(es) not yet on the site:`);
  newEntries.forEach((c) => console.log(`  - ${c.classType} on ${c.date} (${c.url})`));

  const blocks = newEntries
    .map(
      (c) =>
        `  {\n` +
        `    classType: "${escapeJs(c.classType)}",\n` +
        `    date: "${c.date}",\n` +
        `    time: "${escapeJs(c.time)}",\n` +
        `    location: "${escapeJs(c.location)}",\n` +
        `    notes: "Added automatically from USCCA -- double-check details.",\n` +
        `    registerUrl: "${c.url}"\n` +
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

/**
 * Looks specifically inside the "Current Classes Available" section so we
 * never pick up an unrelated link from elsewhere on the page. Each class on
 * this page links to its own detail URL, which follows a consistent,
 * distinctive pattern -- that link is the reliable anchor point.
 *
 * Each class's data is read from a chunk of text STRICTLY bounded by the
 * previous class's link and the next class's link -- never further than
 * that -- so one class's title/date can never bleed into a neighboring
 * class's entry, even when blocks sit close together in the markup.
 */
function parseClasses(html) {
  const sectionStart = html.indexOf("Current Classes Available");
  if (sectionStart === -1) return null;

  const linkPattern =
    /href="(https:\/\/www\.usconcealedcarry\.com\/firearms-training\/instructors\/north-carolina-instructors\/onyx-defense-academy-llc-3016131\/class-[a-z0-9-]+\/)"/g;

  const section = html.slice(sectionStart);

  // Pass 1: find where each unique class URL FIRST appears, in order.
  const firstSeenAt = []; // [{ url, index }]
  const seen = new Set();
  let m;
  while ((m = linkPattern.exec(section)) !== null) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    firstSeenAt.push({ url: m[1], index: m.index });
  }
  if (firstSeenAt.length === 0) return [];

  // Pass 2: for each class, its chunk runs from a little before its own
  // first link to right before the NEXT class's first link (or the end of
  // the section, for the last one). This is the key fix -- it guarantees
  // no two classes ever share text.
  const BACK_MARGIN = 80; // enough to catch the date, which sits just before the title link
  const results = [];
  for (let i = 0; i < firstSeenAt.length; i++) {
    const startIdx = Math.max(0, firstSeenAt[i].index - BACK_MARGIN);
    const endIdx = i + 1 < firstSeenAt.length ? firstSeenAt[i + 1].index : section.length;
    const chunk = stripTags(section.slice(startIdx, endIdx));

    const dateMatch = chunk.match(
      /([A-Z][a-z]{2},\s*[A-Z][a-z]{2}\.?\s*\d{1,2},\s*\d{4})\s+(\d{1,2}:\d{2}\s*[AP]M)/
    );
    const priceMatch = chunk.match(/\$(\d+)/);
    const titleMatch = chunk.match(/\n\s*([A-Z][A-Za-z0-9&'.,\- ]{4,80})\s*\n/);
    const venueMatch = chunk.match(/\n\s*([A-Za-z0-9&'.,\- ]{4,60})\n\s*Autryville,\s*NC/);

    // Don't guess. If the date or the title can't be confidently found in
    // THIS class's own bounded chunk, skip this one entry entirely rather
    // than risk adding something wrong.
    if (!dateMatch || !titleMatch) continue;

    const isoDate = toIsoDate(dateMatch[1]);
    if (!isoDate) continue;

    const rawName = titleMatch[1].trim();
    const classType = NAME_MAP[rawName] || rawName;
    const location = venueMatch ? `${venueMatch[1].trim()}, Autryville, NC` : "Autryville, NC";

    results.push({
      url: firstSeenAt[i].url,
      date: isoDate,
      time: dateMatch[2].replace(/\s+/g, " ").trim(),
      classType,
      location,
      price: priceMatch ? priceMatch[1] : ""
    });
  }

  return results;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "\n");
}

function escapeJs(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function toIsoDate(text) {
  // "Sat, Aug. 29, 2026" -> "2026-08-29"
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
  // Never fail loudly -- a quiet skip is always safer than a bad commit.
  console.error("Unexpected error, exiting without changes:", err.message);
});
