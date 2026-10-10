# Engine selection

Remotion + React + SVG is the maintained default: frame-driven choreography, editable UI, local assets, and deterministic export. Use captured interfaces for accuracy and code layers for motion.

HTML/CSS + Playwright + FFmpeg remains a lightweight fallback. Its contract is `window.video.ready` and `window.video.seek(timeSeconds)`; screenshot only after fonts and images are ready.

WebGPU shaders are optional background materials, baked against frame time. Three.js, Canvas, Lottie, or Rive can be selected for a concrete need, but this repository does not claim prebuilt integrations or test coverage for every engine. A different library alone does not guarantee a better film.
