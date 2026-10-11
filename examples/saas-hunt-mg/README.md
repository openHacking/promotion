# SaaS Hunt — experimental motion graphics

A 30-second, 60fps film for people looking for SaaS tools. English copy, licensed recorded music and action cues, no voiceover. The landscape and portrait movies are independently composed.

- [Landscape movie](video.mp4) / [portrait movie](portrait-video.mp4)
- [Landscape cover](cover.png) / [portrait cover](portrait-cover.png)
- [Silent critical motion study](critical-motion-study.mp4) — internal grouping/filter/expansion verification
- [Storyboard](storyboard.md) / [frame and object index](storyboard.json)
- [Soundtrack](soundtrack.wav) / [music license](public/music/LICENSE.md)
- [Editable project archive](editable-project.zip)
- [Product and asset provenance](product-analysis.json)
- [Validation and adversarial review](REVIEW.md)
- [Five reference studies and all-frame indices](../../references/studies/index.md)
- [Eight motion recipes and replacements](../motion-recipes/README.md)
- [HyperFrames + GSAP comparison](../engine-benchmark/README.md)
- [Previous/new comparison](comparison.mp4): previous film on the left, new film on the right; comparison uses the new soundtrack.

## Rebuild

Use Node.js, FFmpeg, and a supported Chromium browser. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run studio
npm run typecheck
npm test
npm run render -- --format landscape
npm run render -- --format portrait
node scripts/check.mjs out/landscape/video.mp4
node scripts/check.mjs out/portrait/video.mp4
```

Set `PROMOTION_BROWSER` to an existing browser executable when needed. Initialization and preview do not install other skills. The archive excludes dependencies, encoding intermediates, private reference images, and reference videos. Supplementary research/recipe links refer to the repository; the standalone archive contains the editable production project.

Edit factual product records and frame events in `config.json`; edit object choreography in `src/ArchitectureFilm.tsx`. Event timing windows are deliberately bounded for this 30-second interpretation. The initial category set, filtered products, selected card and maker remain independent objects. Portrait uses two-column collections, stacked filtered results, and different typography and paths.

## Reconstruction

Official public pages were checked on 2026-10-11. The product heading crop is authentic evidence from the AppWizzy detail page. Cards and maker panels are original code components using verified names, categories, descriptions and listed maker relationships. Layout, path travel, aggregation and expansion are illustrative choreography. They do not claim that the website animates this way. Maker means the attribution listed by SaaS Hunt, not independently verified legal founder ownership. Supporting descriptors are shortened; the selected AppWizzy description and tags retain the verified fields.

No search, recommendation, payment or subscription action is demonstrated. Reference brands, media and recordings are not reused. The example art direction does not become the default for every Promotion project.

Actual listening remains outstanding. Encoded playback was reviewed muted; audio measurements and detected music contacts do not establish perceived sync or musical quality.
