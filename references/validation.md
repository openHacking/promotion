# Validation record

Date: 2026-10-10. [Machine evidence](validation.json). [SaaS Hunt film review](../examples/saas-hunt/review.md).

## Executed checks

- Four 12-second, 1080p60 original template films and four complete replacement films rendered. All eight decoded-video checks passed (720 frames each).
- Each template replaced brand, copy, palette, and local product image, including a filename containing spaces. Repeated still hashes, image visibility, and long Chinese copy checks passed.
- HTML fallback: nine integration checks passed, including deterministic seeking, four long-copy layouts, missing image/font, remote asset rejection, invalid timing, and exact one-frame keyboard movement.
- Remotion: fourteen configuration tests passed; TypeScript passed. A corrupt local font was rejected by the actual renderer, not only by metadata validation.
- External audio source-offset test passed: changing the trim offset changed the rendered signal without converting the configuration to a private absolute path.
- Native gallery: five video players loaded, advanced during playback, and sought to the end, with no page or HTTP errors.
- Installation, replacement backup, and recognized legacy migration were exercised in an isolated directory. Final active installation is checked separately by the official skill validator.
- SaaS Hunt: all 1800 frames decoded and scanned; fourteen cue onsets matched their authored frame events within 40ms. Repeated PNG renders matched at frames 486 and 1044.

## Human and machine boundaries

Visual inspection covered original-template contact sheets and every SaaS Hunt shot, first/last frames, and both sides of each cut. Repairs and frame evidence are in the film review. Full-frame anomaly scanning is a heuristic; passing it does not establish storytelling quality.

The agent cannot directly hear local audio in this session. Subjective listening, timbral balance, and music masking remain pending. No superiority score or end-to-end production-time promise is claimed.
