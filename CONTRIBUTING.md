# Contributing

Promotion welcomes improvements demonstrated by actual films. Keep repository prose, sample copy, comments, and user-facing diagnostics in English. Multilingual fixtures may use Unicode escapes.

## Development

```sh
cd assets/remotion
npm ci
npm run typecheck
npm test
```

Python helpers can be checked with `python3 -m py_compile scripts/init.py scripts/install.py scripts/example.py` from the repository root. Run the official skill validator when available. Render changes need actual frame inspection, not only type checks.

## Templates

Submit editable source, replacement configuration, a short rendered preview, cover, and asset provenance. Show that another product can replace the demonstration content. Do not include private UI, fabricated metrics, or assets whose redistribution rights are unclear.

## Bug reports

Include the command, platform, Node and FFmpeg versions, relevant sanitized configuration, failing frame/time, and observed behavior. Keep secrets and private product data out of reports.

## Review

Check product truth, layout, foreground continuity, blank/residual frames, and sound alignment. Separate automatic evidence from human visual review and listening. No universal motion score establishes aesthetic quality.

Original contributions are under the repository MIT license. Third-party material retains its own license and must be recorded in THIRD_PARTY_NOTICES.md.
