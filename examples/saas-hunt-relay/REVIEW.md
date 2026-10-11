# Review record

## Evidence boundaries

Automated export checks, visual frame inspection, encoded playback, and actual listening are separate. Listening was not performed. These are review cuts, not an approved soundtrack delivery. No new claim of full-resolution inspection of all reference-video frames is made by this iteration.

## Treatment findings

Times below refer to the 10-second treatment encodes (source range 2.2–12.2 seconds).

- Editorial relay, 1.0–4.0 s: light surfaces separate names and category membership; selected orange remains localized. Provisional visual selection.
- Spatial atlas, 1.0–3.0 s: the orbital distribution is distinct, but dark card surfaces have weaker separation from the canvas and the orbital lines add competing structure.
- Radial aperture, 1.0–3.5 s: radial entry creates a different silhouette; the large ring competes with small card labels. Not selected for this directory explanation.
- All three, 6.2–7.5 s: retained product identity expands into details without replacing the actor. Subsequent descriptor/tag entrance lets the name stay stable.
- Music: candidate recordings are available in the encodes. No preference or comparative audio-quality claim is made without audition.

## Adversarial findings and repairs

1. **Default asset mistaken for a choice.** New initializer output marks bundled music `draft`; the project stores three licensed candidates and a provisional selection. Actual music suitability remains open.
2. **Palette overpowering the subject.** Removed full-orange backgrounds from the selected treatment. Canvas, reading surface, text, selection, and supporting category colors come from config. Alternative palette renders expose contrast tradeoffs. Selected-card background and text now keep their high-contrast roles throughout expansion; interpolating both from light to dark had reduced contrast around the midpoint.
3. **Unmotivated waiting.** Filtering resolves at 7.7 s and expansion begins at 8.35 s (0.65 s to read the retained set). The previous film resolved filtering near 8.9 s and did not start expanding until about 13.1 s. This timing change is evidence of a shorter specific gap, not proof of better rhythm throughout.
4. **Movement destroys reading.** The first full-film pose review found the new maker-section headline overlapping the old product name at 20–21.7 s. The old heading and description now fade before the incoming heading, while the maker identity remains until related products take over. A repair that faded all old content created a brief empty card around 18.7 s; continuous-frame review caught this regression and the persistent maker label repairs it. The label then moves into the heading position as the related products enter; supporting copy waits until the label lands. The Typora study delayed its closing copy until the document cleared the reading region at 6.7 s. A second encoded review found overlapping outgoing/CTA typography at 26.3–27.0 s; the outgoing text now clears by 26.25 s before CTA opacity rises.
5. **Picture and music develop independently.** Shared event frames continue to place visual contacts and generated cues together. Musical phrase fit, perceived accents, masking, mono compatibility, and ending remain unverified until actual listening.

## Pending listening review

Audition each candidate against its treatment, choose or reject the provisional score, check the start at the selected offset and the last three seconds, then listen to the full stereo and mono mixes. Any new music choice requires reauthoring the phrase contacts where needed, rerendering both formats, and repeating the audio/export checks. Do not preserve an alignment claim merely because an onset detector passes.

## Browser playback coverage

The initial three 10-second treatments and the repaired Typora encode each reached `ended=true` at 10.0 seconds in the in-app browser. This confirms playback and provides screen observations; it does not establish actual listening. Treatment contact sheets contain 20 decoded frames each. Pose inspection covered 13 frames in each full-film format before encoding and exposed the overlap defects above. Final encoded review is recorded separately below.

## Rendering observation

One intermediate portrait still-repeat check at frame 486 differed in four RGB channels by one quantization level across independent browser captures. The strict hash check rejected that run. This was measured separately from motion state; the check was not weakened. Final render repeat results are recorded in `qa/portrait/checks.json`. Browser rasterization can therefore require investigation even when the frame-time pose functions are pure.

## Final encoded checks

Both delivery formats contain 1,800 decoded frames at 60 fps and exactly 30 seconds, H.264/yuv420p video with 48 kHz AAC audio. The final encoded peak is -8.54 dBFS. All-frame heuristic scans found no near-uniform or unexpected-large-change candidates; this does not prove visual quality. Final repeated still hashes match at frames 486 and 1044 in both formats. Three treatment variants and the transfer study each contain 600 frames and 10 seconds of audio; randomized-order sample renders return matching repeated-frame hashes.

The Remotion suite passed 69 tests, the HyperFrames suite passed 9, both source and example type checks passed, all five initialized Remotion templates validate, and the skill frontmatter validator passed. Public checks are under `qa/`; listening remains `not-performed`. Final render elapsed time, including post-render checks, was approximately 176 seconds per format while other render jobs ran concurrently. These timings are not engine benchmarks.

Final visual inspection includes encoded full-film contact sheets and 20 consecutive frames at each of f1120–1139, f1210–1229, and f1568–1587 in each format. The maker remains visible during the handoff; its supporting headline waits until the name reaches its new position. The CTA no longer overlaps the outgoing phrase. The selected product retains contrast during expansion.

Both final full-film delivery encodes were played to `ended=true` at 30.0 seconds in the in-app browser using file-hash-tagged URLs. See `qa/playback.json`. After the selected-card contrast refinement, the three treatments were re-encoded, their contact sheets regenerated, and their encoding/repeat checks rerun; that browser playback record refers to the initial treatments.
