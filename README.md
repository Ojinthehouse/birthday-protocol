# Midnight Protocol
A mobile-friendly birthday prank website for October 31. Buildless HTML/CSS/JavaScript, suitable for GitHub Pages.

## Current sequence
Guess a character → gacha account scan → fantastic voice profile → dodging trust/prank buttons → water mission → honest wellbeing check → ten Radiant Tides → supplied first-pull animation → ten reward reveals with rarity animations → collection.

## Customise
Edit `config.js` for the nickname, character answer, character picture, optional singing audio, optional Wuwa purple/gold footage, and all ten rewards. Put your files in `assets/` and use relative paths such as `./assets/phrolova.webp`. Keep exactly ten rewards. Current reward artwork uses emoji placeholders; the mystery silhouette is a chess-piece placeholder until you supply the intended character image. The ten rewards are draft content.

The first pull uses the supplied first-pull.mp4. Subsequent reveals play four-star.mp4 or five-star.mp4 according to rarity, then show the supplied gold background. Playback follows each clip's ended event; skip, unavailable-media fallback, sound toggle, and restart are supported. The final four rewards are Phrolova S0, S1, S2, and Lethean Elegy R1.

Lethean Elegy icon sourced from https://wuthering.th.gl/db/weapons/weapon_21050066 (game artwork © Kuro Games).

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
