# Installation and migration

## Codex

Clone or download this repository, then run `python3 scripts/install.py`. The default destination is `$CODEX_HOME/skills/promotion`, or `~/.codex/skills/promotion` when unset. Use `--destination /path/to/agent/skills/promotion` for another local skill-enabled agent.

The installer excludes Git metadata, dependencies, build output, and caches. It does not install Node packages or change agent configuration. Start a fresh agent session after installation.

## Skills CLI

From a local checkout, `npx skills add . --skill promotion -g` can install the root skill. Select your agent in the CLI. Install the published repository with `npx skills add openHacking/promotion --skill promotion -g`.

## Updating

Run `python3 scripts/install.py --replace` from the new checkout. Existing installations are backed up outside the skills directory before replacement. An installation failure restores the previous destination.

## Migrating from the previous name

The installer recognizes the previous `video-create` installation when it has the expected skill metadata. It archives that copy outside the active skill catalog, then installs Promotion. It refuses ambiguous legacy folders rather than deleting unrelated skills. Previous standalone video projects remain usable; `VIDEO_CREATE_BROWSER` remains a browser-environment alias.

## Runtime

Install Python 3, Node.js 22+, FFmpeg/FFprobe, and Chrome/Chromium. These are separate from skill installation. Run `npm ci` inside each initialized video project. No image-generation provider or paid video service is mandatory.

## Uninstall

Remove the installed `promotion` folder after preserving any needed local changes. Standalone production folders and installer backups are independent. Never remove another skill to uninstall Promotion.
