# Optional generated assets

Choose assets according to the available material and agent capabilities. Use real screenshots or recordings when possible. Without them, code reconstruction or an image-generated UI shell can provide a visual starting point, but neither proves actual product behavior.

Generated shells should leave dynamic text and controls as separate layers. Verify labels, spacing, and state against product evidence. Record the prompt, source references, generator, date, local filename, and hash. If no evidence exists, use a generic illustrative shell and say so.

The optional `uiShell` object provides a local `file` and a `contentRect` in 1920×1080 composition pixels for an independently animated content area. Check that the original image leaves the intended area clear. Simple stage backgrounds need no image model. Legacy `backgroundImage` is still supported but is not the default recommendation.

## Generated material in a visual story

Use generation for a concrete visual need: a concept key frame, an independent subject, an environment plate, an illustration, or material detail. Start with a small number of key frames to test composition and meaning. An environment may need texture and physically convincing light that is expensive to reconstruct in code; a simple circle or flat gradient usually does not.

Separate subjects from their background where they will move. Request actual transparency for cutouts and preserve alpha. Keep perspective, light direction, palette, and materials consistent through shared reference images or edits. A single raster cannot reveal arbitrary unseen sides; change the shot design or use a suitable generation/3D route.

Keep factual UI, logos, numerical claims, and dynamic text independently sourced and composited. Record source references, prompt, generator, date, role, local filename, hash, and whether the asset illustrates or proves anything. Do not distribute private source paths. Inspect generated assets before rendering and check their interaction with moving layers in the encoded video.
