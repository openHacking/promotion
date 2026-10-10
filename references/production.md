# Production workflow

Read product evidence, choose the mode and visual direction, outline the full story, select sound, then build the difficult motion passage. Keep production in an isolated product-promotion directory.

Initialize a project using scripts/init.py. Run npm ci, preview in Remotion Studio, and edit config.json, public assets, and src choreography. All assets are local at export. Validate fonts and images before frame capture; stop on load errors.

Templates use five frame-aligned phases. Freeform stories use any matching shot/phase count and a shared timeline. Use absolute integer frame events for visual and audio actions. Render and preview use the same composition.

Run typecheck and tests, then render, check the final encoded video, and generate the motion diagnostic. Inspect every shot and transition and listen to the full soundtrack. Report installation, rendering, and review costs separately.

Deliver final MP4, cover, storyboard, soundtrack, source project, commands, provenance, and review record. The renderer keeps silent intermediate encoding and stems inside out/.internal/. Existing background-image projects remain supported.
