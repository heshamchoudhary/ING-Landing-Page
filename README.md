# Inspire Netball — 2026 Selection Days landing page

Static site with no build step. Upload the whole `site/` folder to any host (Netlify, cPanel, S3, etc.). `index.html` is the entry page.

## Adding the registration form links
Open `assets/js/main.js` and paste each form URL into `REGISTRATION_LINKS` at the top of the file.
If a link is left empty, its button shows a "Registration opens very soon" message instead of opening a dead page.
Put social profile URLs in `SOCIAL_LINKS` in the same file.

## Content still to be confirmed by the client (marked `TODO` in index.html)
- Testimonial quotes and attributions ("Parent name · Club / association")
- The 2,000+ stat and its "Stat to be confirmed by client." note
- FAQ answers that end in "(to be confirmed by client)"
- Instagram / Facebook URLs

## Structure
- `assets/css/styles.css`: design tokens, layout, and all motion (reveals are wrapped in `prefers-reduced-motion: no-preference`)
- `assets/js/main.js`: link config, load/scroll reveals, location filters, FAQ accordion, parallax, sticky CTA
- `assets/img/`: web-optimised WebP images with JPG/PNG fallbacks
- `assets/docs/`: the privacy policy PDF, linked from the footer
