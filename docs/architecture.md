# Architecture

The repository root is an installable Agent Skill. SKILL.md selects the workflow; references supply motion, audio, engine, and QA guidance only when needed. User setup and examples live in docs and README.

The root npm package is also a DeepSeek Harness bundle. Its Cordis patch mounts a provider that reads the same SKILL.md and registers it with the host's existing skill registry at bundled rank 600. The resource base is the installed package directory, so references and initialization scripts work from linked checkouts and unpacked archives. The host owns discovery precedence, invocation, and provider disposal; the bundle does not introduce video-specific tools or duplicate host services.

scripts/init.py copies a standalone starter into an isolated production folder. That folder owns config.json, src choreography, public assets, dependencies, and output. The Remotion starter renders ProductFilm using one frame clock. Conventional templates use five phases; BrowserStory uses a matching arbitrary-length shot array. The HTML starter retains the explicit ready/seek contract.

The configuration validator checks frame alignment, local paths and realpath confinement, copy constraints, shot structure, optional UI-shell bounds, and shared event IDs. Rendering, QA, and audio use the same validated configuration. The browser asset pipeline waits for fonts and image decoding.

The audio engine generates original music or trims a local licensed track, synthesizes event cues, applies music ducking, and writes a mixed soundtrack. The renderer encodes BT.709 H.264, muxes AAC, and extracts QA images from the final MP4. Intermediate encoding and stems are internal.

The checking script probes and decodes every frame; the motion report produces diagnostic difference curves. Neither judges semantic continuity or aesthetic quality. Human visual inspection and listening remain distinct evidence categories.

The CLI stops its compiler service after bundling and cleanup, then exits after all outputs have been written; lingering bundler worker handles must not leave a completed render waiting indefinitely. Browser selection supports PROMOTION_BROWSER and the legacy environment alias.

Freeform scene shots use independent local assets and shot-local keyframes for layered composition, masks, 2.5D depth, and camera motion. Scene validation shares the public asset boundary; videos remain muted and the global event timeline owns sound. Visual storytelling and capability routing precede full choreography.
