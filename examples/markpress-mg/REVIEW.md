# MarkPress review record

## Scope and status

English 30-second motion graphics, native landscape and portrait, 60fps, no voiceover. Product claims checked against the English homepage and card tool on 2026-10-11. Original vectors are illustrative; there is no claim of a live interaction recording.

**Technical:** passed. **Visual:** encoded contact sheets, selected consecutive-frame ranges, direction studies inspected. Earlier full-cut browser playback is retained as historical evidence; the closing revision was checked in encoded frame extractions. This is not a claim that every full-resolution frame was individually inspected. **Listening:** not performed; an audio stream, browser playback, peaks and metadata do not establish perceived musical quality. Both outputs remain listening-review cuts.

## Adversarial findings and repairs

| Time | Attack | Repair and evidence |
|---|---|---|
| 0.5–2.6 s | Large type looks too weak for the brief. | Registered the local variable font with its 100–900 weight range. Final encoded cover shows the intended heavy glyphs. |
| 9.25–10.6 s | Syntax and divider cross the enlarged preview and muddy the handoff. | Retire them by frame 575; preview expands from frame 585. Consecutive frames 555–574 and 585–604 in both formats show the separation. |
| 14–17 s | Export headline disappears on the light background. | Set label text fill explicitly, rather than assuming SVG group fill overrides `currentColor`. Final contact sheet shows the ink headline. |
| 19–22 s | Portrait fan can exceed the frame and obscure the selected subject. | Reduced portrait card width and spread; the central card is the reading subject, rear cards indicate multiple outputs. Final portrait contact sheet retains central copy and bounded fan. |
| 23–27.5 s | Decorative burst hits headline; final relay leaves a blank field. | Moved landscape burst above/right of the type, extended outgoing SHARE until the closing wipe covers it, increased brand badge clearance. Frames 1605–1624 show the persistent outgoing subject. |

The separate card generator is explicitly named at 17–23 seconds. “Share” describes output intent, not an automatic platform publishing action. The blue hash is an editorial Markdown motif, not an asserted official logo. No AI writing, PDF export, or default cloud upload is depicted.

## Motion and reading assessment

0–3.6 s assembles syntax and relays three words. 3–10.6 s develops an actual source/result relationship through typed lines, scanning and expansion. 10.7–17.8 s changes scale through local storage and a portable file. 17–23.2 s stacks, fans and settles outputs. 22.7–27.5 s switches to oversized verb relays; 27.5–30 s resolves to the product domain. Document and CTA reading rests are deliberate. Remaining aesthetic risk: the longer editor phrase is calmer than the typographic opening and climax; final pacing and music fit should be judged together during the outstanding listening review.

## Automated evidence

Both videos: H.264, yuv420p, 60fps, 1,800 decoded frames, 30 seconds; stereo AAC, 48kHz, 30 seconds. Encoded audio peak: −3.455 dBFS. The all-frame 96×54 grayscale heuristic reported no uniform-frame or unexpected-change candidates; that is a technical screen, not a visual quality score.

Type checking passed; 71 tests passed, including native configurations, frame events, compatibility and Unicode fixtures. Each final format repeated full-resolution frames 486 and 1044 with identical hashes. Each 8-second study rendered out-of-order seeks with matching repeated hashes. See [summary](qa/summary.json), [study render record](treatments/render.json), and [study encoding checks](treatments/encoding-checks.json).

Final render wall times: landscape **90.02 seconds**, portrait **89.74 seconds**, on this machine. These include export work and vary by hardware. Three final direction studies took approximately 17 seconds each at 960×540.

## Music remains provisional

Three local licensed recordings are included in the audible directions. Kinetic uses “Exit the Premises”, selected provisionally from publisher instrument/energy metadata and the visual brief. It is a 15–45 second source excerpt with a closing fade and shared-frame sound contacts. Actual timbre, density, phrase fit, auditory masking and ending have not been listened to here. No claim of musical synchronization quality is made merely because visual and sound events share frame numbers.

## Closing-frame revision

The main landscape and portrait films now display `markpress.pro`. Music attribution is outside the video, on the main gallery, case gallery, and direction comparison page. The source licenses remain included. Checks target three regressions: a stale `/en` suffix, remaining music text in either closing frame, and missing page attribution. Current encode and closing-frame evidence are recorded in `qa/closing-revision.json`.
