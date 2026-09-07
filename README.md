# Sahjanand Group — Website

A 7-page static site: `index.html`, `infrastructure.html`, `products.html`,
`milestones.html`, `management.html`, `investors.html`, `contact.html`.

## Structure
- `styles.css` — all design tokens (colors, fonts, spacing) and layout rules
- `main.js` — mobile menu, active-link highlighting, contact form handling
- `images/` — logo files and favicons

## All text is placeholder
Every company description, stat, project name, team member, and document
listed on the site is a placeholder written to match your business type.
Search each HTML file for the text you want to replace — nothing is pulled
from a database, so it's a direct find-and-replace in the file.

## Logo files
- `images/logo-full.png` — full logo with wordmark, transparent background
  (used in the footer)
- `images/logo-icon.png` — symbol only, no text, transparent background
  (used in the navigation bar and as the source for favicons)
- `favicon.ico` and `images/favicon-*.png` / `apple-touch-icon.png` —
  generated from the icon-only mark

## To view locally
Open `index.html` directly in a browser, or run a local server from this
folder (e.g. `python3 -m http.server`) and visit `http://localhost:8000`.

## To publish
Upload every file in this folder, keeping the same folder structure, to any
static web host (or your existing hosting via FTP/cPanel).
