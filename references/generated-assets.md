# Optional generated assets

Choose assets according to the available material and agent capabilities. Use real screenshots or recordings when possible. Without them, code reconstruction or an image-generated UI shell can provide a visual starting point, but neither proves actual product behavior.

Generated shells should leave dynamic text and controls as separate layers. Verify labels, spacing, and state against product evidence. Record the prompt, source references, generator, date, local filename, and hash. If no evidence exists, use a generic illustrative shell and say so.

The optional `uiShell` object provides a local `file` and a `contentRect` in 1920×1080 composition pixels for an independently animated content area. Check that the original image leaves the intended area clear. Simple stage backgrounds need no image model. Legacy `backgroundImage` is still supported but is not the default recommendation.
