# Pingo closed-test site

This repo is a copy of the `site/` folder of the private app repo. Edit here, or edit there and copy over.

Plain HTML, CSS and JS. No build step, no tracking, no external fonts.

## Before you publish

Open `app.js` and fill the `CONFIG` block at the top. Any value left as `""` makes its button show "Opens soon" instead of a dead link.

| Key | What goes there |
|---|---|
| `signupUrl` | A Google Form that asks for the volunteer's Gmail (and nothing else you do not need) |
| `optInUrl` | The "Join on the web" link from Play Console, Closed testing, Testers (shows up after the first release is approved) |
| `feedbackUrl` | Form or WhatsApp group where testers report problems |
| `contactEmail` | Shown in the footer and on the privacy page |
| `testersJoined` | Update by hand as people join; 0 hides the counter |

After the site is live, set `og:image` in `index.html` to the full `https://...` address of `assets/og.png` so link previews show the picture.

## Publish on GitHub Pages

Settings, Pages, Source: "Deploy from a branch", branch `main`, folder `/ (root)`. The site appears at `https://arunkaushikdev.github.io/pingo-site/`.

Nothing in this repository is secret: it holds no app source code, keys or personal data. The app itself lives in the private `pingo` repository.

## Before the public release

`privacy.html` is a short draft for testers. Replace it with the full privacy policy (ads, purchases, data safety answers) before Pingo goes to production, and use that URL in Play Console.
