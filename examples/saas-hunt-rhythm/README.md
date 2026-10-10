# SaaS Hunt: continuous discovery film

A 30-second, 60fps film about discovering SaaS products through the main SaaS Hunt website. ExportGPT appears briefly as an example detail page, rather than the subject of the promotion.

[Landscape film](video.mp4) · [Portrait film](portrait-video.mp4) · [Editable project](editable-project.zip) · [Review evidence](evidence/review.md)

## Story and direction

The film moves from real product cards into the homepage, product catalogue, Productivity category and a selected detail page. The same panel carries attention through wipes and object transformations. The ending returns to the main site's discovery proposition, categories and makers.

Three concepts were compared: a recorded walkthrough offers strong evidence but little visual distinction; a graphical discovery network makes relationships expressive but can imply unsupported product connections; continuous object handoffs preserve product evidence while providing distinctive, practical code animation. The third was selected. Generated imagery was unnecessary for this interface-led process; exact UI and original motion graphics carry the explanation.

## Timing and formats

Eight action contacts share configured frames with copy changes and sound cues. Recorded music was analyzed before choreography; all eight selected events coincide with detected onset frames. These are onset candidates, not confirmed musical downbeats or a listening-verified climax. Brisk motion includes reading holds. The main discovery proposition peaks at 19.2 seconds; the example detail page occupies approximately 16.3–19.2 seconds.

Landscape is 1920×1080, portrait 1080×1920. Text, cards, panel positions and the closing composition are arranged per canvas, with editable safe insets. These are generic layout margins, not certified platform overlay clearance. Captured website pixels remain accurate and are framed deliberately.

## Rebuild

From the repository:

```sh
python3 scripts/example.py ../saas-hunt-rhythm-project --variant rhythm
cd ../saas-hunt-rhythm-project
npm install
npm run analyze-music
npm run render
npm run render -- --format portrait
npm run check
node scripts/check.mjs out/portrait/video.mp4
```

The ZIP contains source, configuration, local captures, font and recorded music; dependencies must be installed. Edit `config.json`, `src/DiscoveryFilm.tsx` and local assets to change the film. The landscape config and portrait JSON retain the same choreography in native aspect layouts.

## Evidence and rights

Automatic checks and sampled encoded-frame review are recorded separately. Listening has **not been performed**; cue and peak measurements cannot establish musical feel or mix quality. The included soundtrack is available for audition.

Public pages were captured on October 11, 2026. Screenshots are evidence of those pages, not a claim that this was recorded live navigation. Product imagery retains its original rights. Music is the existing CC0 recorded track credited in `public/music/LICENSE.md`. No paid generation service is required.
