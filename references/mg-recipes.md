# Editable frame-time motion recipes

Use `MGSystem` for short isolated studies and `mg-motion.mjs` for reusable frame-time primitives. `recipePose(recipe, frame, fps, index, count, selected, options)` is pure: repeated and out-of-order evaluation must give the same pose. The recipes accept frame time at the API boundary; interval calculations use frame/fps, never Date.now, requestAnimationFrame, or runtime randomness. For a production film, author landing events and durations explicitly rather than inheriting study timings.

| Recipe | Expressive purpose | Editable controls | Failure condition |
|---|---|---|---|
| `type` | Prioritize words; reveal a statement in sequence | words, stagger, masked displacement, skew, landing duration | Stagger exceeds the reading interval; a mask clips settled glyphs |
| `path` | Carry an object from collection to focal region | three Bézier control points, entry duration, item delay | Path crosses the reading subject or reverses without motivation |
| `morph` | Turn a shared geometric idea into the next state | radius, angle, scale, merge interval | Identity disappears; decorative geometry suggests false behavior |
| `aggregate` | Make membership visible | labels, group size, grid spacing, grouping interval | Categories are arbitrary, cards overlap, or labels arrive too late |
| `filter` | Show selection changing the visible set | selected identity, membership, exit scale/opacity, result positions | All objects disappear or selected identity changes |
| `expand` | Keep a selected card continuous into detail | chosen index, target bounds, text reveal, evidence crop | Scaling makes copy tiny; expansion implies an unverified action |
| `flow` | Explain a verified dependency | nodes, connector path, stroke width, draw interval | Connector is decorative or suggests an unsupported dependency |
| `spatial` | Make a collection tangible and focus one object | orbit radius, depth scale, angle, order, focus hold | Continuous rotation prevents reading; depth swaps identity |

Study setup in a story shot:

```json
{"id":"grouping","kind":"mg","mg":{"recipe":"aggregate","headline":"Tools, organized.","items":["Design","Build","Measure","Publish"],"selected":1}}
```

Use `scripts/render-recipes.mjs` to encode eight six-second studies and a replacement-label set. These are silent internal motion tests, not final promotional scores. Inspect their encoded contact sheets, test long names and Unicode identities, and verify masks at entry/landing/recovery frames. Replace product names, labels, counts, and selected identity before claiming portability.

The studies supply small mechanics; `ArchitectureFilm` supplies factual multi-object choreography. High-impact orange/black art direction belongs to the SaaS Hunt example, not to the skill defaults.

`mg.motion` accepts frame values `entryStartFrame`, `entryDurationFrames`, `staggerFrames`, `actionStartFrame`, and `actionDurationFrames`; geometric controls are `spacing`, `groupSpacingX`, `groupSpacingY`, `pathPoints` (three relative quadratic points), `expandScale`, `radius`, `depth`, `angularSpeed`, and `rotation`. Defaults preserve the study behavior except non-overlapping aggregation rows. For example, `"motion":{"actionStartFrame":90,"actionDurationFrames":48,"groupSpacingY":240}` moves the action landing to f138 at any FPS.

For `flow`, the frame interval controls connector drawing. For `morph`, it controls rounded-corner transformation, with `radius` in reference pixels. For `spatial`, optional `focusFrame` freezes orbit travel to create a readable hold; object ordering remains deterministic. Essential names still require a focal layout rather than overlapping orbit cards.

## Compose a relay

Validate combinations in addition to isolated mechanics. For aggregation → filtering → expansion, retain stable product IDs: group membership settles while a category selector prepares; rejected members leave while retained cards travel; one retained card expands while its name stays visible. Description, evidence crop, and maker can then enter in different regions while the name remains readable. Record overlaps and read intervals, not just landing frames.

Do not apply this directory grammar to every product. A writing tool may need a text selection → edited passage → readable document sequence with a slower resolution. Compare different information needs in moving transfer studies.

When promoting a detail label into the next heading, move the existing label rather than fading every old object out. Keep the successor copy away from its travel path until it lands. Boundary review should catch both overlapping names and the opposite regression: an empty carrier after over-aggressive cleanup.
