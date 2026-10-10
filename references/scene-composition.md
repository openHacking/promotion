# Editable layered scene shots

Remotion freeform stories accept `kind: "scene"` with a `scene.layers` array. A scene needs no title or browser frame. Legacy story shots and the four templates remain supported. Scene-only stories may omit legacy title, description, task, result, tagline, category, features, and screenshots. Brand, URL, and evidence label remain required metadata, and are not displayed automatically. Mixed stories and templates retain their legacy product requirements.

All positions and sizes are in 1920×1080 composition pixels. Keyframes and layer lifetimes use **shot-local frames**, regardless of the shot's position in the film. Keyframes must be strictly ordered and within the shot. A layer is visible from `startFrame` (inclusive, default 0) to `endFrame` (exclusive, default shot end). Video layers are muted; soundtrack and cues continue to use the shared global event timeline. `videoStartFrame` trims the video's source in composition frames.

```json
{
  "id": "selection",
  "kind": "scene",
  "transitionFrames": 0,
  "scene": {
    "background": "#f4f1ed",
    "perspective": 2400,
    "camera": [{"frame": 0}, {"frame": 45, "x": 60, "scale": 1.08}],
    "layers": [
      {"id": "environment", "kind": "image", "file": "stage.png",
       "x": 0, "y": 0, "width": 1920, "height": 1080},
      {"id": "chosen", "kind": "image", "file": "product.png",
       "x": 460, "y": 260, "width": 1000, "height": 560,
       "radius": 20, "shadow": true, "mask": "left",
       "keys": [{"frame": 0, "x": -100, "reveal": 0},
                {"frame": 45, "x": 0, "reveal": 1}]}
    ]
  }
}
```

Layers support `image`, `video`, `text`, and `shape`. Images/videos require local public-relative `file`; text requires `text`; shapes require a six-digit hex `color`. Each layer has a unique `id`, `x`, `y`, `width`, and `height`. Optional `depth`, `radius`, `shadow`, text `fontSize`/`color`, and `crop`/`imageWidth` control presentation. Cropped images use source-pixel rectangles; uncropped images fit inside the layer. Video fills the layer.

Keyframes animate relative `x`, `y`, `z`, `scale`, `rotate`, `rotateX`, `rotateY`, `opacity`, and `reveal`. Initial values are zero translation/rotation and unit scale/opacity/reveal. Missing channels inherit the previous pose. The first pose holds before its frame; the last holds afterward. Destination `easing` is `smooth` by default or `linear`. `mask` is `left` or `circle`; reveal affects only masked layers. Camera translation/rotation moves the world inversely; its scale magnifies the world. Depth and perspective establish 2.5D relations, not volumetric 3D geometry.

An optional static `light` has `x`, `y`, `size`, `color`, and `opacity`; this is a compositing wash, not physically simulated illumination. Shadows and consistent source lighting do most of the work. Avoid a wash over text that reduces contrast.

Scenes cut by default; `transitionFrames` explicitly adds a short crossfade. Legacy shots keep their existing default crossfade. Use matched outgoing/incoming object poses when a carried transition matters; the engine does not infer semantic continuity or create real shutter motion blur. Do not exceed the perspective near plane when using depth transforms.
