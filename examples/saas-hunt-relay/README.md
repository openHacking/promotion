# SaaS Hunt — audiovisual relay study

A 30-second, 60 fps, English, no-voiceover review cut in landscape and portrait. The production changes the creative process as well as the example: three audible treatments precede the full film, colors have semantic roles, and persistent objects carry overlapping motion phrases.

**Status: listening review pending.** Music candidates, excerpts, edits, and final mixes have not been auditioned by the reviewer. Do not interpret technical checks or publisher mood tags as musical approval. The selected direction is provisional.

## Watch and compare

- [Landscape review cut](video.mp4)
- [Portrait review cut](portrait-video.mp4)
- [Playable treatment gallery](treatments/index.html)
- [Editorial relay](treatments/ribbon/video.mp4), [spatial atlas](treatments/atlas/video.mp4), [radial aperture](treatments/aperture/video.mp4)
- [Typora transfer study](treatments/transfer/video.mp4)
- [Previous SaaS Hunt film](../saas-hunt-mg/video.mp4)
- [Creative decisions and frame intervals](creative-direction.json)
- [Review evidence and remaining work](REVIEW.md)

The three directory treatments vary the initial organizing construction and palette while keeping the same factual grouping/filter/detail sequence for comparison. The Typora study tests a different communication need: a readable document with Markdown live preview, rather than a category collection. Its interface is reconstructed, not captured. The behavior is supported by [Typora's official product page](https://typora.io/), checked on 2026-10-11.

## Rebuild

From this directory:

```sh
npm ci
npm run typecheck
npm test
npm run render-treatments
npm run render -- --format landscape
npm run render -- --format portrait
node scripts/check.mjs out/landscape/video.mp4
node scripts/check.mjs out/portrait/video.mp4
npm run package-review
```

Set `PROMOTION_BROWSER` to an installed Chrome executable when needed. Rendering writes into `out/`; `npm run package-review` verifies and copies the encodes, covers, soundtrack, and path-free checks to their delivery locations. The top-level MP4 files are copies of those encodes. `npm run render-treatments -- transfer` rebuilds only the transfer study. All export fonts, images, and music are local. Dependencies remain pinned by the package lock. The only machine-dependent input is the browser executable.

`src/RelayFilm.tsx` contains the editable choreography. `config.json` supplies product identities, palette, audio, and shared event frames. The optional `creative-direction.json` records creative reasoning and review status without changing the rendering contract. `src/treatment-index.tsx` contains the comparative treatments and the independent Typora study. Existing templates and configuration formats remain supported.

## Music and product evidence

“Cipher”, “Funkorama”, and “Carefree” by Kevin MacLeod (incompetech.com), licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Excerpts are trimmed, mixed, and faded. See [credits](public/music/LICENSE.md) and [source metadata with hashes](public/music/sources.json). Include the relevant credit and license link wherever a video is published.

The main cut provisionally uses Cipher from 25.6 seconds; the three 10-second treatments use their recorded offsets in `treatments/render.json`. The segment and ending still require actual listening. The old bundled track is not used in these outputs.

SaaS Hunt product names, categories, maker associations, and the authentic detail crop retain the prior verified project data. Card travel and layout are illustrative choreography. The film does not claim search, recommendations, subscription, or automatic product generation by SaaS Hunt.

[Editable source bundle](editable-source.zip) includes the local inputs and build scripts; rendered movies and review images are excluded from the archive and recreated by the commands above. The complete directory also retains all delivered movies and review evidence.
