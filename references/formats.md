# Formats and native composition

Supported Remotion presets: `landscape` (1920×1080, 16:9) and `portrait` (1080×1920, 9:16), at 30 or 60fps. Use landscape for website/desktop presentations, portrait for vertical viewing. These are viewing presets, not promises about any platform's current upload policy.

Create a responsive starter with `python3 scripts/init.py new-project --template discovery --format portrait --duration 30`. It uses original fictional UI. A discovery starter requires at least 24 seconds so the shared events have reading room. The SaaS Hunt case is `python3 scripts/example.py new-project --variant rhythm`.

Run `npm run render` for the configured canvas, or `npm run render -- --format portrait`; overrides export to `out/portrait`. Verify each with `node scripts/check.mjs out/portrait/video.mp4`. The checker reads the adjacent render record for the effective dimensions. Canvas changes preserve the event timeline and soundtrack. Typography, panel proportions, intro card arrangement, feature stacks and CTA layout change natively; the video is not cropped or stretched.

Discovery defaults to 6.5% side margins, 5.5% top and 7.5% bottom margins. Set `discovery.safeInsets` in output pixels when a target player's overlays need more room, then review the actual player. These margins are a general starting point, not verified platform safe zones. Natively authored scene stories use output-pixel coordinates and need explicit per-format configs. Canvas-only CLI overrides are rejected for these stories; set the native dimensions and layout in the authored config. The original four templates and the earlier MG recipes retain their landscape geometry; unsupported non-landscape renders fail clearly instead of silently cropping.

Check every encoded aspect separately: line wrapping, UI name/maker legibility, selected-object position, CTA clearance and transition edges. Timing checks can be shared; composition acceptance cannot.
