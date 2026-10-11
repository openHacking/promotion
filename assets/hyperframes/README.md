# Project-local HyperFrames + GSAP starter

Editable landscape collection/detail choreography with local font, GSAP and licensed recorded audio. Dependencies are exact versions in the lockfile. No skill installation is performed.

```sh
npm ci
npm run studio
npm run render
npm run check
npm run verify-seek
npm test
```

Set `PROMOTION_BROWSER` to an existing browser executable when needed; the render command maps it to `HYPERFRAMES_BROWSER_PATH`. `composition.template` is the editable source; preparation creates a single `index.html`, copies GSAP from the local dependency and builds the score from `config.json` frame events. The base research clip is six seconds. The initializer creates 8–300-second projects; extend the choreography and supply a sufficiently long local recording when authoring longer films.

The GSAP timeline is paused and registered as `window.__timelines.root`. Its timeline contract follows [official documentation](https://hyperframes.app/docs/3-guides/3-gsap-animation). Do not return a paused GSAP thenable from browser evaluation. Preview/export use local resources; product screenshots must be localized before use.

This bounded starter supports 1920×1080, 60fps and four short labels. Portrait, shader backgrounds, or a different object system require authored source work. See [engine comparison](../../examples/engine-benchmark/README.md). Actual listening remains outstanding.
