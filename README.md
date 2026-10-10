# Promotion

**Turn your product into a video people can understand.**

Promotion is an Agent Skill for creating editable launch videos, software demos, and workflow promos from a website, project folder, screenshots, or recordings. Your agent designs the story, animates the product, synchronizes sound, and renders an MP4 locally.

[![SaaS Hunt — continuous discovery](examples/saas-hunt-rhythm/cover.png)](examples/saas-hunt-rhythm/video.mp4)

**[Watch the live gallery](https://openhacking.github.io/promotion/)** · [Download the 30-second SaaS Hunt film](examples/saas-hunt-rhythm/video.mp4) · [Review the example evidence](examples/saas-hunt-rhythm/README.md)

GitHub may show a download link for MP4 files. The local gallery provides native video playback.

[![Source checks](https://github.com/openHacking/promotion/actions/workflows/check.yml/badge.svg)](https://github.com/openHacking/promotion/actions/workflows/check.yml)
[![Gallery deployment](https://github.com/openHacking/promotion/actions/workflows/pages.yml/badge.svg)](https://github.com/openHacking/promotion/actions/workflows/pages.yml)

## Install

In a skill-enabled agent such as Codex, ask:

> Install the Promotion skill from https://github.com/openHacking/promotion.

From a local checkout:

```sh
python3 scripts/install.py
```

This installs `promotion` into `~/.codex/skills/promotion` (or the configured `CODEX_HOME`). Restart or start a new agent session if its skill catalog does not refresh automatically.

Skills CLI users can install with:

```sh
npx skills add openHacking/promotion --skill promotion -g
```

See [installation and migration](docs/installation.md) for other agents and local Skills CLI installation.

### Update

Ask your agent to update Promotion from the same source, or run from the updated checkout:

```sh
python3 scripts/install.py --replace
```

The installer backs up the previous version outside the active skills directory.

## Try it

**From a website**

> Use $promotion to create a 30-second launch video for https://saashunt.pro/. Show the product discovery journey, use English copy, and make the motion lively while keeping the interface readable. Decide the creative direction and finish the video.

**From a project**

> Use $promotion on this project. Understand its real capabilities, show suitable animated templates, and recommend a direction before production.

**Choose a template**

> Use $promotion with the workflow template. Turn these screenshots into a 40-second product demo. Use our brand colors and Chinese captions.

**Create together**

> Use $promotion in collaborative mode. Propose a visual direction and complete storyboard for our launch. After we agree, produce the video and review it.

**Revise a film**

> Make the opening quicker, keep the results visible longer, and soften the background. Align the important actions with the music and rebuild the video.

## Three ways to create

| Mode | Your involvement |
|---|---|
| Template | Choose a starting structure; the agent adapts it to your product. |
| Autonomous | Give the goal and constraints; the agent handles the full production. |
| Collaborative | Agree on the direction and storyboard before production. |

A reference video is welcome, but not required. The agent chooses visual explanations before writing promotional copy. Available image generation is used when it improves subjects, environments, or concept exploration; exact UI and text remain independent layers. Freeform layered scenes can combine real interfaces, generated imagery, video, and code motion without a mandatory headline or browser frame.

## Animated starting points

| Template | Best for | Motion structure |
|---|---|---|
| Minimal launch | Apps, design tools, new products | Brand → hero → feature cards → product focus |
| Window demo | Desktop software, agents, developer tools | Intent → workspace → operation → result |
| Quick command | Search, launchers, shortcuts | Command → selection → immediate result |
| Workflow cards | SaaS, automation, collaboration | Input → connected steps → completed output |
| Continuous discovery | Product directories and discovery journeys | Cards → real catalogue → category → detail → site proposition |

Replace the brand, interface, copy, palette, font, timing, and sound. Freeform creation can change the entire choreography.

To play the gallery locally:

```sh
node scripts/serve.mjs . 5207
```

Open `http://127.0.0.1:5207/assets/gallery/index.html`.

## What you get

One MP4 with sound, a cover, storyboard, soundtrack, editable source project, build commands, and a review report. Defaults are English, 1080p, 60fps, about 40 seconds, and no voiceover. Ask for a different language or duration. Portrait layouts require deliberate adaptation rather than stretching.

## Requirements

A coding agent with local filesystem and command access; Python 3, Node.js 22+, FFmpeg/FFprobe, and Chrome/Chromium. No paid generation service is required. Remotion and optional third-party components retain their own licenses; see [third-party notices](THIRD_PARTY_NOTICES.md).

The agent installs project dependencies on first use. If the downloaded browser cannot start, specify your local Chrome with `PROMOTION_BROWSER`; see [troubleshooting](docs/troubleshooting.md).

## Documentation

- [Install, update, and migrate](docs/installation.md)
- [Use Promotion](docs/usage.md)
- [Edit and rebuild a project](docs/project-guide.md)
- [Architecture](docs/architecture.md)
- [Motion and sound design](references/motion-design.md)
- [Quality and evidence](references/quality.md)
- [Executed validation](references/validation.md)
- [SaaS Hunt example](examples/saas-hunt/README.md)
- [Contribute](CONTRIBUTING.md)

## License

Original code is MIT. Fonts, dependencies, external music, and captured product imagery retain their respective rights. Example screenshots demonstrate SaaS Hunt; they are not generic, relicensed template assets. See [third-party notices](THIRD_PARTY_NOTICES.md).

## Motion graphics

[Three editable MG starters](examples/mg-templates) combine orbital selection, spring type/object regrouping, and staggered strip reveals. Read [MG route and limits](references/motion-graphics.md). Initialize with `python3 scripts/example.py new-project --variant mg`.

## Rhythm, continuity and native formats

[The new SaaS Hunt example](examples/saas-hunt-rhythm/README.md) combines measured music onsets, eight shared motion/copy/sound contacts and a persistent UI panel. Watch [landscape](examples/saas-hunt-rhythm/video.mp4) or [portrait](examples/saas-hunt-rhythm/portrait-video.mp4). Listening remains an explicit outstanding review gate.

Initialize with `python3 scripts/example.py new-project --variant rhythm`, or use the generic `discovery` starter. Native ratio selection is available for this template; bespoke scenes require authored format layouts. See [formats](references/formats.md), [music analysis](references/music.md) and [continuity](references/continuity.md).
