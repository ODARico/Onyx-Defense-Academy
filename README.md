# Onyx Defense Academy — Website

This is your new website. It's plain files (no software to buy, no monthly
site-builder fee) so the only ongoing cost is what you already pay to renew
`onyxdefenseacademy.com` each year.

## What's in this folder

| File | What it's for |
|---|---|
| `index.html` | The page itself — text and layout |
| `styles.css` | Colors, fonts, spacing |
| `script.js` | Makes the schedule and menu work — you shouldn't need to touch this |
| `schedule-data.js` | **The file you'll actually edit** to add class dates |
| `assets/` | Your logo, certification badges, and (soon) your photo |

## See it before you publish anything

Just double-click `index.html` and it'll open in your browser. That's the
real site — nothing else needs to be running. Edit any file, save it, and
refresh the browser tab to see the change.

## Adding a class date

Open `schedule-data.js` in any plain text editor (Notepad, TextEdit, or even
right inside GitHub once it's online — see below). Follow the instructions
written at the top of that file: copy one block, fill in the date/time/
location, save. The website sorts and displays it automatically — you never
need to touch `index.html`.

## Adding your photo

Drop a photo into the `assets` folder named exactly `christian-headshot.jpg`.
It'll appear in the "Meet Your Instructor" section automatically. Until you
add it, that spot just shows a simple placeholder mark — nothing looks broken.

## What's already in the `assets` folder

Your real logo and certification badges are already wired into the site —
you don't need to touch these:

| File | Where it's used |
|---|---|
| `logo.png` | Header and hero section |
| `favicon.png` / `favicon-32.png` / `apple-touch-icon.png` | Browser tab icon, phone home-screen icon |
| `badge-uscca.png` | "Meet Your Instructor" — USCCA seal |
| `badge-ncdoj.png` | "Meet Your Instructor" — NC DOJ Justice Academy seal |
| `badge-notary.png` | "Meet Your Instructor" — NC Notary Association seal |

If you ever want to swap any of these for a higher-resolution or updated
version, just replace the file — keep the same filename and the site
picks it up automatically.

## One thing to fix before you publish

In `index.html`, search for the word `TODO` (your text editor's Find
function, Ctrl+F or Cmd+F) — there's one spot where your Facebook page link
needs to replace a placeholder `#`.

## Putting it online for free, permanently

This uses **GitHub Pages** — free hosting for exactly this kind of site,
run by GitHub (a Microsoft-owned company used by millions of developers and
businesses). No credit card required for this part, ever.

**1. Create a free GitHub account** at github.com, if you don't have one.

**2. Create a new repository**
   - Click the **+** in the top right → **New repository**
   - Name it anything (e.g. `onyx-website`)
   - Set it to **Public**
   - Click **Create repository**

**3. Upload your files**
   - On the new repository's page, click **uploading an existing file**
   - Drag in `index.html`, `styles.css`, `script.js`, `schedule-data.js`,
     and the `assets` folder
   - Click **Commit changes**

**4. Turn on GitHub Pages**
   - In your repository, go to **Settings** → **Pages**
   - Under **Branch**, choose `main` and click **Save**
   - GitHub gives you a working link immediately, like
     `https://yourusername.github.io/onyx-website` — check that it works

**5. Connect your existing domain**
   - Still in **Settings** → **Pages**, find **Custom domain**, type
     `onyxdefenseacademy.com`, and click **Save**
   - Now go to wherever you manage the domain itself (whoever you pay the
     annual fee to — GoDaddy, Namecheap, Google Domains, etc.) and find its
     **DNS settings**
   - Add four **A records**, all pointing your domain to GitHub's servers:

     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

   - This can take anywhere from a few minutes to a few hours to take effect
   - Back in GitHub's **Settings → Pages**, once it shows a green checkmark
     next to your domain, check the **Enforce HTTPS** box — this gives your
     site the small lock icon browsers show for secure sites

That's it — from then on, editing a file in GitHub (or uploading a new one)
updates your live site automatically within a minute or two.

## Why this instead of Google Sites again

Your files live in a repository you own and can download a full backup of
at any time (**Code → Download ZIP** on the repository page). If anything
ever looked wrong, you'd be able to see exactly what changed and when —
which is the protection you didn't have before.

## If something looks off

Open `index.html` in your browser and check the browser's "console" (right
click the page → Inspect → Console tab) for red error text — or just send
the files back to whoever helped you build this.
