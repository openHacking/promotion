# Six-second engine comparison

[Play comparison](comparison.mp4): Remotion on the left, HyperFrames + GSAP on the right. [Remotion](remotion.mp4) and [HyperFrames](hyperframes.mp4) are audible 360-frame, 60fps landscape clips with the same local font, colors, labels, geometry, landing frames and soundtrack. The comparison contact sheet is [here](contact.jpg).

| Mechanism | Action / landing |
|---|---|
| Masked title entry | 0–42 / 0–0.70s |
| Category-style card aggregation | 99–138 / 1.65–2.30s |
| Filtering and survivor repositioning | 159–198 / 2.65–3.30s |
| Selected card expansion | 213–258 / 3.55–4.30s |
| Detail entry | 255–273 / 4.25–4.55s |

Rendered locally with two workers and an existing Chrome browser. The latest observed times were 30.27s for Remotion and 20.01s for HyperFrames. The recorded pipeline times include different setup boundaries and concurrent workload; they are observations, not a controlled speed ranking. See [Remotion timing and hashes](remotion-render.json), [HyperFrames timing](hyperframes-render.json), [HyperFrames seek evidence](hyperframes-seek.json) and [encoded checks](hyperframes-check.json).

Remotion repeated independent frame requests pass exact SHA256 equality. HyperFrames passes 20 same-page non-monotonic requests with repeated exact screenshot hashes, loaded fonts and the expected final card bounds (410,340,1400,520). The latter specifically tests state residue. A paused GSAP timeline must be registered under the composition ID according to the [official contract](https://hyperframes.app/docs/3-guides/3-gsap-animation). Returning that timeline from browser evaluation was found to hang because it is thenable; the starter seek wrapper intentionally returns no timeline.

Encoded inspection shows a clean title mask and preserved card identity through grouping, filtering and expansion in both routes. Minor rasterization and detail-opacity interpolation differences remain; cross-engine pixels are not asserted identical. Both master WAV files have SHA256 `79c96ef769b99e351ce10b5421f0a4fa6db10262f65bfae91398cc10046add38`. The five cue landings share the same frame events. AAC decoding/encoder padding is not a substitute for a listening sync check. Actual listening remains outstanding.

## Rebuild

In `assets/remotion`: `npm ci`, then `npm run render-benchmark` (encodes the visual study and muxes the shared licensed soundtrack from `benchmark-config.json`). In `assets/hyperframes`: `npm ci`, `npm run render`, `npm run check`, `npm run verify-seek`. Its preview/render commands prepare a single `index.html` from `composition.template`, with localized GSAP, font and recorded sound. The initializer `--engine hyperframes` was also exercised in a fresh eight-second project: 480 encoded frames, expected resolution/fps/audio and duration passed.

The production film remains Remotion. GSAP supplies DOM/SVG sequencing and interpolation; HyperFrames supplies the HTML export pipeline. Product causality, hierarchy, readable holds and useful motion still need authored decisions.
