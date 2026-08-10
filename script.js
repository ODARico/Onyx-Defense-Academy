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
