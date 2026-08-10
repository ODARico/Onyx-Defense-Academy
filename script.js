/* ==========================================================================
   ONYX DEFENSE ACADEMY — site script
   No frameworks, no build step — plain JS so the site stays free to host
   and easy to edit by hand.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Scroll reveal ----
     !! KNOWN TRAP -- READ THIS BEFORE ADDING A NEW SECTION TO THE SITE !!

     Anything with class "reveal" starts at opacity:0 (see styles.css, the
     ".reveal" rule) and only becomes visible once it gets tagged "is-visible".

     The old version of this code grabbed its list of .reveal elements ONCE, at
     page load. That meant any HTML built LATER by JavaScript -- like the class
     schedule rows -- was created already invisible and stayed that way forever.
     No error, no warning, nothing in the console. The page just looked empty.
     That is exactly what happened in Aug 2026: the Aug 29 class was sitting on
     the page the whole time at zero opacity.

     The fix: activateReveals() below can be called AGAIN, any time. So if you
     ever add a new JS-drawn section (shop, testimonials, gallery, whatever),
     call activateReveals(yourContainer) right after you build it -- or simply
     don't put class "reveal" on generated elements at all. */
  var revealObserver = null;
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }

  // Call this any time new .reveal elements are added to the page.
  function activateReveals(root) {
    (root || document).querySelectorAll(".reveal").forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add("is-visible");
    });
  }

  activateReveals();

  /* ---- Instructor photo fallback ----
     If assets/christian-headshot.jpg is missing or fails to load, show the
     placeholder mark instead. The fallback stays hidden by default so it
     never overlaps a photo that loaded successfully. */
  const photo = document.getElementById("instructor-photo-img");
  if (photo) {
    photo.addEventListener("error", function () {
      const container = photo.closest(".instructor-photo");
      if (container) container.classList.add("has-error");
    });
  }

  /* ---- Schedule rendering ----
     Reads window.scheduleData (defined in schedule-data.js) and renders
     it into #schedule-list, soonest date first, past dates dropped. */
  const CLASS_LABELS = {
    "Concealed Carry": { tag: "CCH Permit Course" },
    "Basic Handgun": { tag: "Beginner Friendly" },
    "Handgun One-on-One": { tag: "Private Session" },
    "NC Concealed Carry Legal Refresher": { tag: "Classroom Only" }
  };

  // Parses "YYYY-MM-DD" as a LOCAL date (not UTC), so the date shown
  // always matches the date typed in schedule-data.js, regardless of
  // the visitor's timezone.
  function parseLocalDate(dateStr) {
    const parts = String(dateStr).split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    const [y, m, d] = parts;
    const dt = new Date(y, m - 1, d);
    return isNaN(dt.getTime()) ? null : dt;
  }

  function formatDate(dt) {
    const weekday = dt.toLocaleDateString("en-US", { weekday: "short" });
    const rest = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return { weekday, rest };
  }

  function telHref(digits) { return "tel:+1" + digits; }
  function smsHref(digits) { return "sms:+1" + digits; }

  function renderSchedule() {
    const container = document.getElementById("schedule-list");
    const emptyState = document.getElementById("schedule-empty");
    if (!container || !emptyState) return;

    let entries = [];
    try {
      const raw = (typeof scheduleData !== "undefined" && Array.isArray(scheduleData)) ? scheduleData : [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      entries = raw
        .map(function (item) {
          const dt = parseLocalDate(item.date);
          return dt ? Object.assign({}, item, { _date: dt }) : null;
        })
        .filter(function (item) { return item && item._date >= today; })
        .sort(function (a, b) { return a._date - b._date; });
    } catch (err) {
      // Malformed schedule-data.js shouldn't take the whole page down —
      // fall back quietly to the empty state.
      entries = [];
    }

    if (!entries.length) {
      container.hidden = true;
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    container.hidden = false;
    container.innerHTML = "";

    entries.forEach(function (item) {
      const { weekday, rest } = formatDate(item._date);
      const meta = CLASS_LABELS[item.classType] || { tag: "Class" };
      const row = document.createElement("div");
      row.className = "schedule-row reveal";
      row.setAttribute("data-class-type", item.classType);
      row.innerHTML =
        '<div class="schedule-row__date"><span class="weekday">' + weekday + '</span>' + rest + '</div>' +
        '<div class="schedule-row__info">' +
          '<span class="schedule-row__tag">' + meta.tag + '</span>' +
          '<h4>' + item.classType + '</h4>' +
          '<p>' + (item.time || "") + (item.location ? " &middot; " + item.location : "") + '</p>' +
          (item.notes ? '<p>' + item.notes + '</p>' : "") +
        '</div>' +
        '<div class="schedule-row__cta">' +
          (item.registerUrl
            ? '<a class="btn btn--red" href="' + item.registerUrl + '" target="_blank" rel="noopener">Register Now</a>'
            : '<a class="btn btn--outline" href="' + telHref("9105878450") + '">Call to Reserve</a>') +
        '</div>';
      container.appendChild(row);
    });

    // Newly built rows are invisible until this runs. Do not remove.
    activateReveals(container);
  }

  renderSchedule();

  /* ---- Student reviews ----
     Reads window.reviewsData (defined in reviews-data.js) and renders it into
     #reviews-list, newest first. If the list is empty or the file is missing,
     the whole section hides itself so the page never shows an empty shell. */
  function renderReviews() {
    var section = document.getElementById("reviews");
    var container = document.getElementById("reviews-list");
    if (!section || !container) return;

    var items = [];
    try {
      var raw = (typeof reviewsData !== "undefined" && Array.isArray(reviewsData))
        ? reviewsData : [];
      items = raw.filter(function (r) { return r && r.quote && String(r.quote).trim(); });

      // Show a handful at random rather than the whole list, so the section
      // stays readable and repeat visitors see different reviews. Set the
      // number in reviews-data.js (reviewsShowCount).
      var show = (typeof reviewsShowCount === "number" && reviewsShowCount > 0)
        ? reviewsShowCount : 3;
      if (items.length > show) {
        for (var i = items.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
        }
        items = items.slice(0, show);
      }

      // Within whatever got picked, show the newest first.
      items.sort(function (a, b) {
        return String(b.date || "").localeCompare(String(a.date || ""));
      });
    } catch (err) {
      items = [];
    }

    if (!items.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    container.innerHTML = "";

    items.forEach(function (r) {
      var card = document.createElement("figure");
      card.className = "review-card reveal";
      var attribution = r.name ? String(r.name) : "Verified student";
      var label = r.classId ? '<span class="review-card__class">' + r.classId + "</span>" : "";
      card.innerHTML =
        '<div class="review-card__stars" aria-label="5 out of 5 stars">' +
          '<svg viewBox="0 0 120 24" aria-hidden="true">' +
            '<use href="#onyx-star" x="0"/><use href="#onyx-star" x="24"/>' +
            '<use href="#onyx-star" x="48"/><use href="#onyx-star" x="72"/>' +
            '<use href="#onyx-star" x="96"/>' +
          "</svg>" +
        "</div>" +
        "<blockquote>" + String(r.quote) + "</blockquote>" +
        '<figcaption>' + attribution + label + "</figcaption>";
      container.appendChild(card);
    });

    // Newly built cards are invisible until this runs. Do not remove.
    activateReveals(container);
  }

  renderReviews();

  /* ---- Class card -> jump to its scheduled date ----
     Tapping a pricing card scrolls down to that class's row on the calendar
     and flashes it. If that class has no date posted, a small notice fades
     in inside the card pointing at the Text To Inquire button instead.
     Card headings must match the classType values used in schedule-data.js. */
  function findScheduleRow(classType) {
    var rows = document.querySelectorAll(".schedule-row");
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute("data-class-type") === classType) return rows[i];
    }
    return null;
  }

  function scrollToRow(el) {
    var header = document.querySelector(".site-header");
    var offset = (header ? header.offsetHeight : 0) + 20;
    var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    var reduce = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
    } catch (err) {
      // Very old browsers don't accept the options object.
      window.scrollTo(0, top);
    }
  }

  function hideNoticeLater(notice) {
    if (notice._hideTimer) window.clearTimeout(notice._hideTimer);
    notice._hideTimer = window.setTimeout(function () {
      notice.classList.remove("is-showing");
    }, 7000);
  }

  function showNoDateNotice(card) {
    var notice = card.querySelector(".class-card__notice");
    if (!notice) {
      notice = document.createElement("p");
      notice.className = "class-card__notice";
      notice.setAttribute("role", "status");
      notice.innerHTML =
        "<strong>No date on the calendar for this one yet.</strong> " +
        "Tap Text To Inquire below &mdash; private dates are booked by request.";
      var cta = card.querySelector(".class-card__cta");
      if (cta) card.insertBefore(notice, cta);
      else card.appendChild(notice);
    }
    // force a reflow so the fade re-runs on repeat taps
    notice.classList.remove("is-showing");
    void notice.offsetWidth;
    notice.classList.add("is-showing");
    hideNoticeLater(notice);
  }

  document.querySelectorAll(".class-card").forEach(function (card) {
    var heading = card.querySelector("h3");
    if (!heading) return;
    var classType = heading.textContent.trim();

    card.classList.add("class-card--tappable");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Show scheduled dates for " + classType);

    function activate(e) {
      // let the Text To Inquire button do its own thing
      if (e.target && e.target.closest && e.target.closest("a")) return;
      var row = findScheduleRow(classType);
      if (row) {
        scrollToRow(row);
        row.classList.remove("is-flagged");
        void row.offsetWidth;
        row.classList.add("is-flagged");
        window.setTimeout(function () {
          row.classList.remove("is-flagged");
        }, 2400);
      } else {
        showNoDateNotice(card);
      }
    }

    card.addEventListener("click", activate);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        activate(e);
      }
    });
  });

  /* ---- Rotate promotional offer images ----
     Each offer link can list several image options in data-offer-images
     (comma-separated). On each page load, one is picked at random so
     repeat visitors see some variety instead of the same image every time. */
  document.querySelectorAll("[data-offer-images]").forEach(function (link) {
    var options = link.getAttribute("data-offer-images")
      .split(",")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (options.length < 2) return;
    var img = link.querySelector("img");
    if (!img) return;
    img.src = options[Math.floor(Math.random() * options.length)];
  });

  /* ---- Interactive reciprocity map ----
     Draws the US map from us-map-paths.js (generated geometry, don't edit) and
     colors it from reciprocity-data.js (the file Rico edits). Clicking a state
     fills the detail panel. Falls back silently if either file is missing --
     the static map image stays in the markup as a no-JS fallback. */
  var RECIP_MEANING = {
    yes: {
      label: "Honors your NC permit",
      text: "This state recognizes a North Carolina concealed handgun permit. You still have to follow that state's own rules about where and how you may carry."
    },
    constitutional: {
      label: "Honors your NC permit \u2014 permitless carry state",
      text: "This state recognizes your North Carolina permit, and also allows permitless carry for qualifying adults. Carrying on your permit can still be worth it \u2014 it travels to other states and can matter for where you're allowed to carry."
    },
    restricted: {
      label: "Honors your NC permit, with restrictions",
      text: "This state recognizes your North Carolina permit but attaches conditions to it. Check the specifics for this state before you carry there."
    },
    no: {
      label: "Does NOT honor your NC permit",
      text: "This state does not recognize a North Carolina concealed handgun permit. Do not carry here on your NC permit."
    },
    home: {
      label: "Your home state",
      text: "North Carolina \u2014 where your permit is issued."
    },
    unknown: {
      label: "Status not set",
      text: "No status has been recorded for this state yet. Check an official source before traveling."
    }
  };

  // Small states get a tap target in a chip row instead of an on-map label.
  var RECIP_CHIPS = ["VT","NH","MA","RI","CT","NJ","DE","MD","DC"];

  function renderReciprocityMap() {
    var host = document.getElementById("recip-map");
    var panel = document.getElementById("recip-panel");
    if (!host || !panel) return;
    if (typeof usMapGeometry === "undefined" || typeof reciprocityData === "undefined") return;

    var byAbbr = {};
    (reciprocityData.states || []).forEach(function (st) { byAbbr[st.abbr] = st; });

    var geo = usMapGeometry;
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + geo.w + " " + geo.h);
    svg.setAttribute("class", "recip-svg");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Map of the United States. Select a state to see whether it honors a North Carolina concealed handgun permit.");

    var selected = null;

    function select(abbr) {
      var st = byAbbr[abbr];
      if (!st) return;
      var meaning = RECIP_MEANING[st.status] || RECIP_MEANING.unknown;

      if (selected) selected.forEach(function (el) { el.classList.remove("is-selected"); });
      selected = [];
      Array.prototype.forEach.call(
        document.querySelectorAll('[data-state="' + abbr + '"]'),
        function (el) { el.classList.add("is-selected"); selected.push(el); }
      );

      var links = "";
      if (st.officialUrl) {
        links += '<a class="btn btn--outline" href="' + st.officialUrl + '" target="_blank" rel="noopener">' + st.name + " official carry info</a>";
      }
      if (reciprocityData.lawUrl) {
        links += '<a class="btn btn--red" href="' + reciprocityData.lawUrl + '" target="_blank" rel="noopener">Check current law at the USCCA</a>';
      }
      if (reciprocityData.usccaUrl) {
        links += '<a class="btn btn--outline" href="' + reciprocityData.usccaUrl + '" target="_blank" rel="noopener">Book a class with us</a>';
      }

      panel.innerHTML =
        '<p class="recip-panel__state">' + st.name + "</p>" +
        '<p class="recip-panel__status recip-status--' + (st.status || "unknown") + '">' + meaning.label + "</p>" +
        "<p>" + meaning.text + "</p>" +
        (st.note ? '<p class="recip-panel__note">' + st.note + "</p>" : "") +
        '<div class="recip-panel__links">' + links + "</div>" +
        '<p class="recip-panel__disclaimer">Reciprocity changes. Verify with an official source before you travel armed. This is not legal advice.</p>';
    }

    Object.keys(geo.paths).forEach(function (abbr) {
      var st = byAbbr[abbr] || { name: abbr, status: "unknown" };
      var p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", geo.paths[abbr]);
      p.setAttribute("class", "recip-state recip-status--" + (st.status || "unknown"));
      p.setAttribute("data-state", abbr);
      p.setAttribute("tabindex", "0");
      p.setAttribute("role", "button");
      p.setAttribute("aria-label", st.name + ": " + (RECIP_MEANING[st.status] || RECIP_MEANING.unknown).label);
      p.addEventListener("click", function () { select(abbr); });
      p.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); select(abbr); }
      });
      svg.appendChild(p);
    });

    Object.keys(geo.labels).forEach(function (abbr) {
      var xy = geo.labels[abbr];
      var t = document.createElementNS(svgNS, "text");
      t.setAttribute("x", xy[0]);
      t.setAttribute("y", xy[1] + 4);
      t.setAttribute("class", "recip-label");
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("aria-hidden", "true");
      t.textContent = abbr;
      t.addEventListener("click", function () { select(abbr); });
      svg.appendChild(t);
    });

    host.innerHTML = "";
    host.appendChild(svg);

    // chip row for the states too small to tap on the map
    var chipWrap = document.getElementById("recip-chips");
    if (chipWrap) {
      chipWrap.innerHTML = "";
      RECIP_CHIPS.forEach(function (abbr) {
        var st = byAbbr[abbr];
        if (!st) return;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "recip-chip recip-status--" + (st.status || "unknown");
        b.setAttribute("data-state", abbr);
        b.setAttribute("aria-label", st.name + ": " + (RECIP_MEANING[st.status] || RECIP_MEANING.unknown).label);
        b.textContent = abbr;
        b.addEventListener("click", function () { select(abbr); });
        chipWrap.appendChild(b);
      });
    }

    var asOf = document.getElementById("recip-asof");
    if (asOf && reciprocityData.asOf) {
      asOf.textContent = "Statuses last verified " + reciprocityData.asOf + ".";
    }

    var stat = document.getElementById("recip-static");
    if (stat) stat.hidden = true;
    var live = document.getElementById("recip-live");
    if (live) live.hidden = false;

    select("NC");
  }

  renderReciprocityMap();

  /* ---- Optional inquiry form ----
     The form on contact.html posts to a third-party form service (Formspree).
     Until a real endpoint is pasted into its action attribute, the form hides
     itself so visitors never see a contact form that silently goes nowhere.
     See the comment in contact.html for the two-minute setup. */
  var inquiryForm = document.getElementById("inquiry-form");
  if (inquiryForm) {
    var action = inquiryForm.getAttribute("action") || "";
    var wrap = document.getElementById("inquiry-wrap");
    if (action.indexOf("PASTE_YOUR_FORM_ID") !== -1 || !action) {
      if (wrap) wrap.hidden = true;
    } else {
      inquiryForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = document.getElementById("inquiry-status");
        var button = inquiryForm.querySelector("button[type=submit]");
        if (button) { button.disabled = true; button.textContent = "Sending..."; }
        fetch(action, {
          method: "POST",
          body: new FormData(inquiryForm),
          headers: { Accept: "application/json" }
        }).then(function (res) {
          if (!res.ok) throw new Error("bad response");
          inquiryForm.reset();
          if (status) {
            status.textContent = "Got it \u2014 we'll get back to you shortly. For anything urgent, text (910) 587-8450.";
            status.className = "inquiry-status is-ok";
          }
        }).catch(function () {
          if (status) {
            status.textContent = "That didn't send. Please text or call (910) 587-8450 instead.";
            status.className = "inquiry-status is-err";
          }
        }).then(function () {
          if (button) { button.disabled = false; button.textContent = "Send Request"; }
        });
      });
    }
  }

  /* ---- SMS link compatibility ----
     Android reads the prefilled message with "?body=", but iOS needs
     "&body=" instead. This rewrites every sms: link on the page for iOS
     visitors only, so the prewritten text still shows up either way. */
  var isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
  if (isIOS) {
    document.querySelectorAll('a[href^="sms:"]').forEach(function (a) {
      a.href = a.href.replace("?body=", "&body=");
    });
  }
})();
