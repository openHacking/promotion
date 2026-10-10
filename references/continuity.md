# Continuity and reading holds

Name a foreground carrier at each transition: a selected card, browser window, task bubble, or result. Record its outgoing and incoming position and identity. Review the actual frames before, during, and after the boundary. Persistent background texture or a fixed logo does not establish semantic continuity.

A stable window can contain meaningful internal operations. A deliberate cut is acceptable when it improves understanding; explain it rather than manufacturing a perfect continuity score.

Fast movement may benefit from real shutter sampling, but CSS blur is not temporal motion blur. This engine does not claim true shutter blur. Keep small UI type stable instead of relying on blur or repeated zooms.

The motion report exports full-frame and central-region pixel differences and estimated quiet intervals. Background light and texture affect those measurements. They are diagnostic evidence, not a readability or semantic-continuity score.

## Default continuous handoffs

Story shots now default to a 0.45-second dissolve, including MG and layered scenes. Explicit `transition: {type: "wipe", frames: 36, direction: "right"}` reveals the incoming shot over the outgoing endpoint; `dissolve`, `slide`, and explicit `cut` are also available. Existing `transitionFrames` remains supported; zero requests a cut. Shot time does not change, and the previous endpoint is held while the new shot animates. Keep the incoming opening readable and do not use this fallback as proof of matched subjects.

The discovery composition uses one persistent panel and object coordinates across phases: intro cards converge into the panel, catalog/category contents reveal inside it, the selected real row separates and expands into the detail page, and the subject recedes as the platform proposition enters along the same left alignment. It does not switch scene components at phase boundaries. Review contact and exit frames, not only covers.
