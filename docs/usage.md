# Using Promotion

Provide a website, project folder, or local material, and describe the audience, desired message, duration, and any brand constraints. Missing optional information can be inferred from product evidence; an explicit user choice takes priority.

## Modes

Template mode adapts one of four animated starting points. Autonomous mode designs and completes the film independently. Collaborative mode agrees on a visual direction and complete storyboard before execution. Explicitly selecting a mode skips the initial menu.

## References and assets

A reference video helps identify framing, movement, pacing, and sound. It is not required and is not copied into the output by default. Product screenshots and recordings provide accurate UI. Reconstructed or generated interfaces are documented as illustrations; they cannot establish real functionality.

## Language and format

The default is English, landscape 1920×1080, 60fps, about 40 seconds, and no voiceover. Ask for another language or duration. Chinese copy is supported by the bundled font. A portrait video requires a redesigned composition and an explicit technical check.

## Revision prompts

Be concrete: name the moment, desired emphasis, and reading constraint. Examples: “At 12 seconds, hold the category selection longer”; “Keep the window stable while the description is visible”; “Use fewer sound effects and a quieter background.”

## Music and sound

New Remotion projects start with a bundled CC0 recording. Select and audition an appropriate segment before treating it as a final score. `python3 scripts/init.py product-promotion --music procedural` explicitly selects the synthesized sketch; `--music energetic` explicitly selects the recording. HTML projects retain procedural music by default.

For another track, put it in `public/`, set `audio.mode` to `file`, set `audio.source` to its public-relative path, and document its license and credit. Use `audio.sourceOffsetSeconds` for the selected segment. Individual timeline events support local recorded effects, material selection, gain, pan, lead, duration, or muting; see [music guidance](../references/music.md). Automated peaks and cue-window balance do not replace listening.

## Delivery

Expect one MP4 with sound, cover, storyboard, soundtrack, editable project, build commands, and a review report. The report separates automated checks from visual review and listening. Render speed is measured on the actual machine rather than promised in advance.

### MG alternative

Use `python3 scripts/example.py new-project --variant mg` for the 30-second ExportGPT discovery study. [Three playable recipe studies](../examples/mg-templates/README.md) offer orbit selection, elastic type/object regrouping, and split masks. Recipes can be mixed with real UI and layered scenes through story shots. Their source is editable React/SVG, and the original four template configurations remain supported.

### Rhythm and formats

Use the responsive `discovery` template for a continuous product directory film, or create the [SaaS Hunt rhythm case](../examples/saas-hunt-rhythm/README.md) with `--variant rhythm`. Run `npm run analyze-music` before editing frame events. Render with `npm run render -- --format portrait` for native alternate layouts. See [formats](../references/formats.md) and [music analysis](../references/music.md). Legacy templates retain landscape support.
