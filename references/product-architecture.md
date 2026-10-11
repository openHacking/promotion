# Product architecture to visible motion

A directory film explains four relationships: a category contains products; a category selection changes the visible set; a selected product has details; that product belongs to a maker. These relationships provide motion subjects and causal changes. Do not imply search, recommendations, payment, subscription, or generated results unless demonstrated by the product source.

Record each capability with its evidence URL/date, user action, and visible result. Keep three asset roles separate: authentic capture (proof of appearance), reconstructed component (editable representation of verified fields), and abstract graphic (relationship or emphasis). A reconstruction can rearrange content for legibility; it cannot invent a capability. Retain the original product name, category, and maker. Document shortened descriptors.

Use an object record such as:

```json
{"id":"product-a","kind":"reconstructed-card","source":"https://example.com/products/a","before":{"category":"Design","state":"directory"},"trigger":"select-category","motionFrames":[492,533],"landingEvent":"filter","after":{"state":"filtered"},"holdFrames":[533,605],"secondaryPreparationFrames":[570,625],"handoff":"same-card-expands-to-detail"}
```

Establish the causal relationship before choreography. Selection, response, reading, and handoff may overlap; they are not mandatory sequential time blocks. Keep the selected subject's name, color, relative position, or outline continuous. A shape wipe can preserve a point of attention; a crossfade between unrelated layouts cannot prove object continuity.

Map independent objects: headline words, category labels, each product card, name, descriptor, tags, authentic crop, maker label, connector, CTA. Use masks and stagger to prioritize them. Assign each burst one primary subject. Reading time belongs to the product name and outcome, not only the headline. Remove supporting copy before shrinking it below useful size.

For a category scene, test membership against actual data. For details, verify that expansion keeps the selected identity. For a maker handoff, make the relationship explicit and verify ownership. Space can encode grouping and selection; avoid orbiting everything throughout a reading hold.

Recompose portrait independently: two-column sets, stacked filtered results, reduced typography, shorter lines, and different paths. Native composition is required; landscape cropping loses relationships.

`src/ArchitectureFilm.tsx` and `scripts/architecture-config.mjs` implement one 30-second experimental interpretation. Configurable product records are in `examples/saas-hunt-mg/config.json`. Event windows are validated because the choreography has fixed reading regions. Change the authored windows with the source when changing duration.

The optional `architecture.choreography: "relay"` selects the audiovisual-development example. It uses persistent actors and overlapping intervals, with semantic palette roles from the existing color config and optional `architecture.secondary`. Its event windows are separately validated; legacy windows remain unchanged when the option is absent. `direction` selects the comparison study's `ribbon`, `atlas`, or `aperture` entry construction. This remains a bounded 30-second directory example, not a default for other product types.
