# MarkPress — Make ideas move.

The core Promotion showcase: **30 seconds, 60fps, English, no voiceover**, with independently composed 1920×1080 and 1080×1920 motion graphics. [Watch the review page](index.html), [landscape film](video.mp4), [portrait film](portrait-video.mp4), or [three audible direction studies](treatments/index.html).

## Creative direction

Markdown syntax is the visual material. It assembles into type, scans into a preview, contracts into a browser-local document, folds into a portable `.md` file, and becomes a fan of share cards. Electric blue provides the action field, ink isolates the document, white supports reading, and acid yellow marks a small number of contacts. This direction answers this case's high-impact brief; it is not the skill's default style.

The three 8-second studies compare **Kinetic press**, **Signal flow**, and **Paper press**. Kinetic was selected on visual grounds. All three include different licensed electronic music excerpts. Actual listening is unavailable, so music choice, phrase fit, masking, and ending remain unapproved. These are audible **listening-review cuts**.

## Product evidence

Verified on 2026-10-11 against the [English site](https://markpress.pro/en), [editor](https://markpress.pro/editor), and [Markdown to Card Generator](https://markpress.pro/en/tools/markdown-to-card). The film depicts Markdown writing, live preview, local storage by default, `.md` download, and a separate card-generation tool. It does not claim automatic publishing, AI writing, or roadmap exports.

All visuals are original vector illustrations of verified behavior, not exact UI or an interaction recording. The `#` badge is an editorial Markdown motif. The card sequence is explicitly labeled as a separate generator and uses illustrative styling. No reference-video artwork or third-party product screenshots are included.

## Editable source and rebuild

Download [editable-source.zip](editable-source.zip) or use this directory. Node.js 22+, npm, and FFmpeg/ffprobe are required. Dependencies are pinned in the lockfile. Install with `npm ci` in a clean extraction; the repository development symlink is not in the zip.

```sh
npm ci
npm run typecheck
npm test
npm run studio
npm run render-studies
npm run render -- --format landscape
npm run render -- --format portrait
npm run package-review
```

`src/Film.tsx` is the authored SVG/React composition. It evaluates directly from the requested frame, without wall-clock animation or runtime randomness. `config.json` and `config.portrait.json` supply native canvas dimensions, colors, local inputs, and shared visual/sound contact frames. Story labels supply export metadata; they do not replace the authored composition. `src/study-index.tsx` contains the alternative directions. Change product claims and choreography together when adapting it; replacing the brand string alone is insufficient.

[Creative record](creative-direction.json) · [Review evidence](REVIEW.md) · [Technical summary](qa/summary.json) · [Landscape storyboard](landscape-storyboard.png) · [Portrait storyboard](portrait-storyboard.png) · [Soundtrack](soundtrack.wav).

## Music credit

“Exit the Premises”, “Robobozo”, and “Raving Energy (faster)” by Kevin MacLeod (incompetech.com). Licensed under [Creative Commons: By Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Edited excerpts, fades, and original synchronized sound effects. Music attribution is provided on the gallery and comparison pages and in the source licenses; the full film has a clean closing frame. Keep attribution when redistributing. [Sources and hashes](public/music/sources.json).
