# Engine selection

Remotion + React + SVG is the maintained default: frame-driven choreography, editable UI, local assets, and deterministic export. Use captured interfaces for accuracy and code layers for motion.

HTML/CSS + Playwright + FFmpeg remains a lightweight fallback. Its contract is `window.video.ready` and `window.video.seek(timeSeconds)`; screenshot only after fonts and images are ready.

WebGPU shaders are optional background materials, baked against frame time. Three.js, Canvas, Lottie, or Rive can be selected for a concrete need, but this repository does not claim prebuilt integrations or test coverage for every engine. A different library alone does not guarantee a better film.


## Project-local HyperFrames + GSAP

Initialize with `python3 scripts/init.py new-project --engine hyperframes --duration 30`. Run `npm ci`, `npm run studio`, `npm run render`, `npm run check`, and `npm run verify-seek` inside that folder. The copied starter pins HyperFrames 0.8.146, GSAP 3.13.0, and Puppeteer Core 25.10.0 with a lockfile. Initialization only copies source; it does not install dependencies, install a skill, or modify an existing project. An existing browser can be selected with `PROMOTION_BROWSER` (mapped to `HYPERFRAMES_BROWSER_PATH` for the CLI).

GSAP must be paused and registered in `window.__timelines` under the matching composition ID. Use timeline seek, not play, timers, or wall-clock animation during export. Follow the [official animation contract](https://hyperframes.app/docs/3-guides/3-gsap-animation) and [HTML schema](https://hyperframes.app/docs/6-reference/html-schema). `window.video.seek(t)` intentionally returns no GSAP object: timelines are thenable, and returning a paused timeline from a browser evaluation can hang the caller. The same-page non-monotonic screenshot test exercises this boundary.

`prepare.mjs` validates frame-aligned landing events, localizes GSAP, generates a local licensed soundtrack using the same event-cue mixer, and writes a single `index.html` from editable `composition.template`. Preview and render both use that generated entry. Font, images, GSAP and music are project-local. Choose a sufficiently long licensed recording when increasing duration; short sources are rejected rather than silently looped. The starter is a bounded landscape collection/detail study, not a drop-in replacement for every Remotion project.

The current film remains Remotion. GSAP improves the authoring vocabulary for DOM/SVG and timeline orchestration; HyperFrames provides its HTML render pipeline. Neither supplies product insight, hierarchy, continuity, or good rhythm automatically. Use the [measured comparison](../examples/engine-benchmark/README.md) to evaluate a concrete route, including seek correctness and encoded mask edges. Render times are one local run, not a universal engine ranking.
