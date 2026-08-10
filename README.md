# Onyx Defense Academy — Website

Plain HTML, CSS and JavaScript hosted free on GitHub Pages. No site-builder
subscription — the only ongoing cost is renewing `onyxdefenseacademy.com`.

## The three files you actually edit

| File | What you change in it |
|---|---|
| `schedule-data.js` | Class dates on the calendar |
| `reviews-data.js` | Student reviews shown on the home page |
| `reciprocity-data.js` | Which states honor an NC permit, and the "verified" date |

Each one has full instructions in a comment at the top. You should not need to
open anything else.

## Everything else

| File | What it's for |
|---|---|
| `index.html` | Home page |
| `classes.html` | Classes, pricing, reciprocity map, class schedule |
| `about.html` | About + credentials + service area |
| `notary.html` | Additional services (mobile notary). Nav calls it "Services" |
| `contact.html` | Contact info, plus an inquiry form that stays hidden until connected |
| `styles.css` | Colors, fonts, spacing — shared by every page |
| `script.js` | Makes the schedule, reviews, map and menu work — don't hand-edit |
| `us-map-paths.js` | Generated map outlines — never edit |
| `sitemap.xml`, `robots.txt` | Help search engines index the site |
| `assets/` | Logo, badges, photo, share image |

## Things worth knowing

**The invisible-content trap.** Anything with class `reveal` starts invisible
and fades in on scroll. If new content is built by JavaScript, it must call
`activateReveals()` afterwards or it renders invisible with no error. This bit
us once already — the details are commented in `script.js`.

**Shared content appears on more than one page.** The phone number, email and
footer are in every HTML file. Change one, check the rest.

**Class names must match.** The four headings on `classes.html` have to match
the `classType` values in `schedule-data.js` and the `classId` values in
`reviews-data.js`, character for character, or the links between them break.

**Reciprocity is legal information.** Re-verify `reciprocity-data.js` against
an official source whenever you change it, and update the `asOf` date.

**Deploys.** Commit, wait about a minute, then hard-refresh (Ctrl+Shift+R).
Upload a whole batch in one commit rather than one file at a time.
