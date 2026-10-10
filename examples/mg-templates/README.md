# Original MG recipe studies

Play `orbit.mp4`, `elastic.mp4`, or `split.mp4`. Each ten-second study repeats a five-second phrase and uses the supplied SaaS Hunt/ExportGPT assets. These are editable choreography starters, not generic relicensed product imagery.

Create a project with `python3 scripts/example.py new-project --variant mg`, copy the chosen JSON to that project's `config.json`, install with `npm ci`, and run `npm run render`. The implementation is `assets/remotion/src/MotionGraphics.tsx`; change its frame-based choreography when adapting the recipe. Existing four templates retain their IDs and behavior.
