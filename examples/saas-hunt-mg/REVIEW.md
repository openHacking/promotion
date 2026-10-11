# Encoded validation and adversarial review

## Automated evidence

The maintained Remotion source passes type checking and 66 tests, including legacy config handling, missing/local assets, Unicode identities, category membership, timeline bounds, event/audio mixing and stateless motion evaluation. The HyperFrames starter passes nine validation tests, CLI lint with zero errors/warnings, same-page random seek and repeated screenshot hashes. A freshly initialized eight-second starter passes 480 frames, dimensions, FPS, audio presence and duration. The skill frontmatter validator passes.

The existing HTML fallback integration passes nine checks across four legacy templates, long Unicode copy, missing assets, invalid durations and one-frame keyboard stepping. It compares exact DOM state; a measured glyph-edge raster difference can use a maximum of eight changed channels and two levels per channel. The final run needed no tolerance. This is distinct from the exact screenshot hashes required for Remotion and HyperFrames.

Both final films have 1,800 decoded frames, 30.000 seconds, 60fps, H.264/yuv420p and 48kHz AAC audio. Encoded audio peak is about −7.41dBFS, without digital clipping. Each decoded frame is scanned for near-uniform blanks and unexplained large changes; an intentional cut at f1440 is declared. The scan is a heuristic, not a visual-quality verdict. See the format check, render, audio and playback JSON records under `qa/`.

## Visual evidence

Both actual encoded movies were played continuously, muted, through their final frame; playback records capture media-time callbacks and completion. Contact sheets were inspected for every shot. Consecutive 16-frame strips around opening wipe, grouping, filter landing, detail landing, crop reveal, maker landing, intentional peak cut and CTA landing were inspected independently for both formats. The previous/new comparison preserves the earlier movie and makes the improvement visible: the old screenshot-driven sequence becomes independently moving category members, a survivor card, readable expanded details and an explicit maker relationship. The official crop remains recognizable in the new detail state.

The card grouping, filtering and expansion segment was encoded and repaired before full delivery. Subsequent final checks identified and fixed blank wiping frames, crop-mask fragments and a hard palette flash. SVG circle geometry and opacity/translation now replace the two affected CSS clip-path reveals. Browser paint behavior is the suspected cause of the fragments; that cause is an inference, while the decoded artifact and its removal are observed facts.

## Independent listening evidence

**Not performed.** The first reference contains no audio. The other four reference tracks and the final soundtrack require actual listening. Detected onset contacts, shared event frames, cue windows and safe peak levels are measured evidence only. No claim of verified phrase quality, perceptual synchronization, sound-effect clarity or musical climax is made. The music is a locally stored CC0 recording by TinyWorlds, with license/source files retained; it is not a reference recording.

## Five adversarial challenges

| Challenge | Timestamp / evidence | Repair or constraint | Recheck |
|---|---|---|---|
| Abstract motion hides the directory relationship | 5.25–8.88s | Real categories aggregate their own members; selection highlight begins with filtering, then AppWizzy and Unabyss survive | Group/filter continuous strips and readable result hold |
| Rebuilt components imply false capabilities | 13.0–22.5s | Use verified names, category, descriptor, tags, authentic detail crop and listed maker; document reconstructed layout; no unsupported operation | Product-analysis provenance and selected identity continuity |
| Impact overwhelms reading | 2.73–3.0s, 8.88–13.0s, 15.43–19.0s | Replace blank wipe with subject/title relay; provide stable result/detail holds; separate portrait layout | Full-frame scan and corresponding encoded strips |
| Transition loses its subject | 13.0–15.6s and 19.13–23.6s | Carry the same selected card into detail, reveal maker connector, return actual same-maker products; remove crop-mask fragment | Crop reveal and maker landing continuous frames |
| Seek retains state | Six-second engine study, non-monotonic requests | Paused GSAP registry, local loaded fonts, thenable-free seek wrapper; pure Remotion frame poses | Exact repeated screenshot hashes and expected final bounds |

The added portrait category labels were moved inward after a 24.65s encoded review found the capsule clipped at the right edge; both labels and safe areas require checking after any replacement. The 24.0s contrast cut is intentional and followed immediately by kinetic statement entry. The film's reading regions are restrained; replacing product records still requires a fresh render and visual review. Quality is demonstrated by clearer relationships and useful motion mechanisms, not claimed as a universal “best video” ranking.
