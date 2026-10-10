# Troubleshooting

## Browser startup

The default renderer downloads Chrome Headless Shell. If it cannot start, use an installed browser:

```sh
export PROMOTION_BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

On Linux or Windows use the actual executable path. A cold browser download can fail or time out independently of composition correctness. The previous `VIDEO_CREATE_BROWSER` variable remains an alias.

## Missing fonts or images

Assets must exist inside `public/`. Absolute paths, URLs, traversal, and symlinks escaping that folder are rejected. A failed font load stops rendering; it must not silently change layout. Rename or copy local files instead of pointing at temporary download paths.

## Text overflow

Shorten the copy, allocate more room, or redesign the shot. Smaller type is not a universal repair. Check long Latin words and Chinese copy at actual output size.

## Audio issues

Check the selected source offset, cue frame, music level, and ducking. Loudness and clipping checks do not establish good rhythm. Listen to the encoded film, including the ending. If the host cannot play audio, disclose that limitation.

## Shader support

Keep shaders optional. The default SVG/CSS background needs no WebGPU. Disable `--shader` if GPU setup fails; do not replace readable UI with a dominant effect.

## Rendering time

Dependency installation, browser download, design, rendering, and QA are separate costs. Compare timings only when resolution, fps, duration, assets, and hardware are recorded.

## Color and compatibility

The maintained Remotion export explicitly uses BT.709 limited range and yuv420p for conventional MP4 playback. Do not fix a color check by only relabeling full-range pixels; render with the proper conversion.
