# Music, sound, and shared time

## Choose a recorded score first

New Remotion projects label the bundled CC0 recording as draft material. Its presence is an export convenience, not music selection. Original films compare at least three licensed excerpts with moving treatments. Use `--music procedural` only for an original, deterministic sketch or when recorded assets are unavailable. The legacy HTML starter keeps its procedural default. Existing projects retain their configured music.

Choose music for the product and narrative, not only its energy. Audition a candidate inside the film before final choreography: drums, density, phrase changes, reading holds, and the ending matter more than a genre label. A restrained track can leave more room for action sound than a continuous full-density groove. Record source, creator, license, collection date, and asset hash. The bundled TinyWorlds track is CC0; its estimated 125 BPM is not a measured downbeat grid.

External sources support `audio.sourceOffsetSeconds`; record measured beat frames and useful phrase frames in `timeline`. Select a range long enough for the film. Rendering rejects sources more than 10 ms short (codec boundary tolerance) instead of silently padding the score with silence. Do not loop or cut across a phrase without listening to the join.

## Score actions, leave rests

`timeline.events` drives visual action accents and SFX. A shot can reference an event by ID. Start motion early enough to land on it. Use fewer sounds than visible micro-actions, with distinct movement and contact layers; preserve quiet reading sections. Avoid repeatedly resolving every scene with the same two-note notification chord.

The Remotion engine provides original deterministic `air`, `click`, and `impact` materials with noise transients, shaped envelopes, stereo panning, and a small shared early-reflection space. These are synthesized materials, not recordings or an AI music service. They are starting points for audition, not a substitute for bespoke foley. Override individual cues with licensed local recordings:

```json
{
  "id": "card-contact",
  "frame": 240,
  "kind": "select",
  "sound": {
    "source": "audio/card-contact.wav",
    "sourceOffsetSeconds": 0.1,
    "durationSeconds": 0.18,
    "gain": 0.8,
    "pan": -0.3,
    "license": "User-provided recording"
  }
}
```

Sources are public-relative. `sound.material` chooses `air`, `click`, or `impact` when no source is supplied. `sound.leadSeconds` starts a cue before its event, rounded to a whole video frame; the default 0.32-second air sweep starts 0.16 seconds early to place its envelope centre near contact. For recordings, set the lead from the audible contact transient rather than the file start. `sound: false` suppresses the cue. Gain is 0–2, pan is −1–1, duration is 0.02–10 seconds, and lead is 0–2 seconds. Short tails fade to prevent hard-cut clicks. Recorded clips preserve their own room; generated cues share subtle stereo reflections.

## Mix and verify

Both recorded and procedural music use the same short entrance/exit fades and smooth event-shaped ducking. Overlapping duck windows take the largest reduction rather than multiplying into a volume hole. Final gain only reduces peaks above 0.75 (about −2.5 dBFS); it does not boost a quiet score or claim to achieve a LUFS target. Check the AAC output for codec overshoot.

`audio.json` records actual music/SFX peaks, source hashes, cue contact and start frames, master gain, and music/SFX RMS in the first 150 ms of each contact. These window ratios are masking diagnostics, not perceptual or frequency-band judgments. Listening remains `not-performed` until separately recorded by a reviewer. Verify beat placement, audible contact, masking, stereo/mono compatibility, reading rests, and the ending in the encoded film.

For release, deliver the final audible MP4 and soundtrack. Internal silent encoding and music/SFX stems stay under `.internal/`.

## Reference findings

Reviewed on 2026-10-10. [video-shotcraft sound design](https://github.com/Vincentwei1021/video-shotcraft/blob/main/references/sound-design.md) uses recorded BGM and a curated material/SFX library, central frame cues, dynamics, and in-film audition. Its documentation also identifies unresolved provenance for some older assets; do not assume that copying a repository grants every audio license.

[onetake sound design](https://github.com/feitangyuan/onetake/blob/main/references/sound.md) identifies raw sine tones, flat dynamics, dense event ticks, and absent shared space as failure modes. It emphasizes material transients, motion-derived timing, rests, and measuring masking in event windows. Its source palette carries a noncommercial license. This implementation uses general DSP principles and independently authored code; no reference code or media is bundled.

## Analyze before choreography

Run `npm run analyze-music` on a recorded source. `out/music-analysis.json` records the source hash, selected offset, FPS, measured onset frames and strengths, onset-supported versus estimated beats, strong-beat candidates, energy-change candidates and an energy envelope. The independent spectral-flux detector uses 1024-sample windows and 256-sample hops at 22050 Hz. Times are quantized onto the video frame grid; this is an estimate of musical attacks, not sample-perfect or perceptual alignment. Tempo has half/double ambiguity. Neither a louder window nor a strong onset proves a phrase, downbeat or climax. Silent material returns no invented beats.

After choosing the excerpt and musical structure through audition, use measured onsets as candidate anchors for important events. Do not force every visual event onto a detector peak. Use the final event IDs for code animation and SFX. Discovery uses `home`, `catalog`, `browse`, `filter`, `select`, `detail`, `expand`, and `cta`. Its main brand proposition fully reveals at `expand`, not at the example product's entrance. `rhythm.profile` is `brisk` by default or `measured`; the latter lengthens the default handoff. Other film types remain a creative decision.

Rendering analyzes recorded music automatically and retains the report. Optional `rhythm.requireOnsetAlignment` rejects events more than one frame from a detected onset. Optional `rhythm.analysisSourceSha256` rejects a changed source. These are technical checks against the detector, not proof of a listening pass. Replace the markers when changing the music segment, FPS or narration. A delayed sweep may begin before the marker, while its contact and the visual landing share the marker.

## Candidate comparison and editing

For each candidate record the excerpt range, provenance, license, intended narrative role, and listening status. Compare timbre, density, phrase development, reading space, and resolution in context. A publisher's mood tags are search aids, not listening evidence. Prefer a useful musical section over always starting at zero. Audition any cut, crossfade, tempo adjustment, or tail; disclose provisional edits when audition is unavailable. Keep the selected source and edits reproducible locally.
