# Sahjanand — Website

A 7-page static website for Sahjanand:
`index.html`, `infrastructure.html`, `products.html`, `milestones.html`, `management.html`, `investors.html`, `contact.html`.

## Structure
- `styles.css` — modern corporate design tokens (deep navy palette, typography, layout, components) inspired by the Eagle Group reference
- `main.js` — mobile menu drawer, active-link highlighting, dynamic year, modal viewer, contact form handling with product query pre-selection
- `images/` — logo files with the registered trademark (``) symbol and favicons

## Logo files
- `images/logo-full.png` — full logo with wordmark, Sanskrit motto, and registered `` symbol, transparent background (used in footer)
- `images/logo-icon.png` / `images/logo-icon-reg.png` — symbol with registered `` symbol, transparent background (used in navigation bar and hero constellation)
- `favicon.ico` and `images/favicon-*.png` / `apple-touch-icon.png` — generated from the registered mark

## To view locally
Run a local HTTP server from this folder (e.g. `python -m http.server 8000`) and visit `http://localhost:8000`.

## To publish
Upload all files to any static web host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or FTP/cPanel).
