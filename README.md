# Midnight Protocol
A mobile-friendly birthday prank website for October 31. Buildless HTML/CSS/JavaScript, suitable for GitHub Pages.

## Current sequence
Guess a character → gacha account scan → fantastic voice profile → dodging trust/prank buttons → water mission → honest wellbeing check → ten Radiant Tides → four-star animation → midpoint pause → rewind → five-star animation → first-pull clip → ten reward reveals → collection.

## Customise
Edit `config.js` for the nickname, character answer, character picture, optional singing audio, optional Wuwa purple/gold footage, and all ten rewards. Put your files in `assets/` and use relative paths such as `./assets/phrolova.webp`. Keep exactly ten rewards. The first six rewards use emoji artwork, and the final four use Phrolova and weapon artwork.

The ten-pull starts four-star.mp4, pauses halfway with the birthday intervention message, rewinds to its beginning, then plays five-star.mp4 and first-pull.mp4. All ten reward reveals then use the supplied gold background without repeating any animations. Playback follows each clip's ended event; skip, unavailable-media fallback, sound toggle, and restart are supported. The final four rewards are Phrolova S0, S1, S2, and Lethean Elegy R1.

Lethean Elegy icon sourced from https://gachatracker.app/games/wuwa/weapons/lethean-elegy/ (game artwork © Kuro Games).

## GitHub Pages
1. Create a repository and upload the contents of this folder at its root.
2. Open Settings → Pages → Build and deployment → Source: **Deploy from a branch**.
3. Choose **main**, **/ (root)**, then Save.
4. GitHub displays the published URL after deployment. All links/assets are relative to support project URLs.

The included `.github/workflows/check.yml` runs JavaScript syntax checks on pushes and pull requests. No npm install or build is required.

## Local preview
Use any static file server, e.g. `python -m http.server 8000` from this folder, then open localhost:8000.

## Notes
- No real accounts, scans, purchases, tracking, credentials, or backend.
- No date lock, so the whole experience can be tested before October 31.
- Progress is in memory and restarts on reload. Restart cancels pending animation timers.
- Optional sound begins only after the visitor enables it. Reduced-motion preferences disable CSS animation.
- A GitHub Pages site and its assets are public. Do not include private details.
- This is an unofficial personal fan project, unaffiliated with Wuthering Waves or its publisher.

Lingyang portrait: https://gachatracker.app/games/wuwa/characters/lingyang/ (game artwork copyright Kuro Games).

S1 animated artwork: https://tenor.com/en-IN/view/phrolova-wuthering-waves-drive-driving-cry-gif-11760760868172603458
S2 animated artwork: https://tenor.com/en-IN/view/nono-phrolova-phrolova-nono-gif-11222211335723166748
