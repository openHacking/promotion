# Quality and adversarial review

Check the final encoded film: resolution, frame rate, duration, complete decoded frame count, audio presence and duration, and clipping. Repeat still renders at the same frames to check determinism. Scan all frames for uniform surfaces and unexpected large changes, then investigate candidates rather than treating them as automatic failures.

Review every shot and frames surrounding transitions for foreground handoff, readable copy, incorrect UI, blank/residual frames, and misleading claims. Listen to the film for beat alignment, cue audibility, masking, and the ending. Record automatic results, visual review, listening, and untested areas separately.

Attack the delivery from five directions: product truth, replacement failure, layout/readability, unexpected frame state, and sound/visual misalignment. Give frame numbers or timestamps and evidence for each. A clean scanner is not proof of a good film. See examples/saas-hunt/README.md for the current real-product validation.

For visual stories, also challenge opaque metaphors, misleading implications, generated-asset inconsistency, spatial motion that prevents reading, and raster-only movement without meaningful change. Compare what pictures explain against the previous cut, not just word counts. Report unavailable listening explicitly; analysis of peaks, onsets, or waveforms is not listening evidence.
