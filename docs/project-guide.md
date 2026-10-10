# Editing a project

## Create

```sh
python3 scripts/init.py ../my-product-promotion --template minimal --duration 30
cd ../my-product-promotion
npm ci
npm run studio
```

Edit `config.json` for brand, copy, palette, local assets, phase durations, and audio. Edit `src/` for choreography. Put fonts, images, recordings, and licensed music in `public/`; paths in config are public-relative.

## Freeform stories

Set `template` to `story` and define frame-aligned `sceneDurations` and matching `story` shots. Each shot has `id`, `title`, optional `subtitle`, `file`, `kind`, and optional `crop`, `fromCrop`, `focus`, and `scrollTo`. A `cards` montage contains cropped rows with their own shared `eventId` landings. Kinds are `brand`, `page`, `cards`, `detail`, and `outro`. `crop` uses pixels in the local screenshot. Set `imageWidth` to its original width (default 1440). Optional `carrierFile` and `carrierCrop` carry a selected object through a page handoff. Titles and the screenshots should tell one coherent journey; this interface is a starter, not a replacement for custom scene code.

`timeline.events` is the shared array of `{id, frame, kind, sound?}` events. Optional `sound` configures a material or local recorded cue, pan, gain, duration, and lead; `false` leaves the event silent. A shot can reference an `eventId` for its visual focus pulse; the audio engine consumes the same event. Event kinds are `transition`, `select`, `resolve`, and `brand`. `timeline.beatFrames` records actual or authored beat positions; `phraseFrames` records useful musical phrase boundaries.

For external music configure `audio.source`, `sourceOffsetSeconds`, `bpm`, `musicVolume`, `sfxVolume`, and `duckAmount`. An offset trims the source before the final mix. Verify beat positions against that segment rather than assuming the first sample is a downbeat.

## Rebuild and inspect

```sh
npm run typecheck
npm test
npm run render
npm run check
npm run check-cues
npm run motion-report
```

`out/video.mp4` is the final film. `out/cover.png`, `out/storyboard.png`, and `out/soundtrack.wav` accompany it. `out/qa/` contains decoded samples and diagnostics. Silent and stem files are stored under an internal directory, not exposed as deliverables.

To reproduce the supplied example: `python3 scripts/example.py ../saas-hunt-promotion`, then follow the same npm commands. It copies captured local material; network access to the product website is not needed for rendering.

## Layered visual stories

For title-free scenes, independent image/video/shape/text layers, masks, depth, and shot-local camera keyframes, see [scene composition](../references/scene-composition.md). Concept and storyboard decisions follow [visual storytelling](../references/visual-storytelling.md); tools are selected using [capability routing](../references/agent-capabilities.md).
