# Review / SaaS Hunt

Date: 2026-10-10. Final film: 30 seconds, 1920×1080, 60fps, 1800 decoded frames. Warm render plus still/encoded-frame inspection generation: 172.431 seconds. A fresh npm ci took about 22 seconds. These are measured components, not an end-to-end production promise.

## Machine evidence

- [Encoded-video checks](evidence/video-check.json): all checks passed; H.264, yuv420p, 1080p60, 30 seconds, complete frame scan, audible-track presence, 48kHz AAC. Peak: -10.4535 dBFS; audio duration: 30 seconds.
- All 1800 decoded frames scanned. Zero near-uniform or unplanned-large-change candidates. This downsampled heuristic does not prove visual quality.
- [Repeated stills](evidence/render.json): frames 486 and 1044 produced matching SHA256 values on repeated PNG renders.
- [Cue alignment](evidence/cue-alignment.json): all shared events produced a detectable SFX-stem onset within 40ms. Visual focus reaches full opacity at frames 360, 960, and 1200. This is signal and authored-frame evidence, not proof of subjective audibility.
- [Motion diagnostic](evidence/motion-report.json): reading holds are present; difference curves are not used as a semantic continuity score.

## Visual review

Reviewed every shot midpoint, first/last frames, and decoded samples around cuts at frames 180, 420, 720, 1020, 1380, and 1620. [Contact sheet](evidence/contact.png) and [storyboard](storyboard.png) provide the overview.

The opening and closing contain a visible brand. The homepage, catalog, AI category, and product detail remain attributable to captured public pages. The selected product is carried into the detail transition; the closing directory montage uses actual cropped rows. Product copy remains independent of decorative typography. The subdued stage does not compete with the page content. Fine UI metadata is supporting detail; large captions carry the primary message.

## Adversarial findings and repairs

| Risk | Evidence and result |
|---|---|
| Product claims invented | Source captures and provenance describe public browsing only; no authenticated actions or growth claims. Captured counters are not used as popularity proof. |
| Fixed template stretched to 30s | Seven independently timed shots, including a selected-card handoff and three-card montage at 23–27s. Source configuration reproduces the sequence. |
| UI or copy unreadable | Reviewed page and title states around 6s, 10s, 16s, 20s, and 25s. Major messages remain readable; fine page metadata is not presented as required reading. |
| Blank, residual, or incorrectly encoded frames | Full scan passed. Initial export exposed full-range color tagging; corrected to actual BT.709 limited-range conversion rather than weakening the check. The selected-card transition was changed to width-based scaling with a crop-height limit after frame 1044 exposed enlarged, clipped text. [Repaired frame 1044](evidence/frame-1044.png) confirms only the selected row remains in its carrier. The final montage removes its underlying page after extraction rather than leaving duplicate ghost rows. Storyboard's unused tile uses the stage color. |
| Sound disconnected from action | Selection focus and SFX share events at 6s, 16s, and 20s; the final montage has accents at 24s, 24.5s, and 25s. Stem onset and headroom passed. Subjective listening remains pending. |

## Remaining limitations

This agent session cannot directly hear local audio. Full subjective listening, timbral balance, and music masking have **not** been certified; assess them from the playable film before publishing. Automated audio checks do not substitute for that judgment.

Navigation, card expansion, and page reframing are authored illustration, not live recorded interactions. Captured pages may change after collection. The film makes no claims about the depicted products beyond the public page content. True shutter-sampled motion blur is not implemented or claimed. No numerical or categorical superiority over another skill is asserted.
