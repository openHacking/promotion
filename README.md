# Promotion

**Turn your product into a video people can understand.**

Promotion is an Agent Skill for creating editable launch videos, software demos, and workflow promos from a website, project folder, screenshots, or recordings. Your agent designs the story, animates the product, synchronizes sound, and renders an MP4 locally.

[![MarkPress — Make ideas move](examples/markpress-mg/cover.png)](examples/markpress-mg/video.mp4)

**[Watch the live gallery](https://openhacking.github.io/promotion/)** · [Watch the 30-second MarkPress film](examples/markpress-mg/video.mp4) · [Review the example evidence](examples/markpress-mg/README.md)

GitHub may show a download link for MP4 files. The local gallery provides native video playback.

[![Source checks](https://github.com/openHacking/promotion/actions/workflows/check.yml/badge.svg)](https://github.com/openHacking/promotion/actions/workflows/check.yml)
[![Gallery deployment](https://github.com/openHacking/promotion/actions/workflows/pages.yml/badge.svg)](https://github.com/openHacking/promotion/actions/workflows/pages.yml)

## Install

In a skill-enabled agent such as Codex, ask:

> Install the Promotion skill from https://github.com/openHacking/promotion.

Or install directly from GitHub with the Skills CLI:

```sh
npx skills add openHacking/promotion --skill promotion -g
```

Select your agent in the CLI, then start a fresh agent session if its skill catalog does not refresh automatically. No manual clone is required.

See [installation and migration](docs/installation.md) for local development, other agents, and migration.

### DeepSeek Harness (dsh)

In the dsh client:

1. Open **Plugins** in the sidebar and click **Add plugin**.
2. Paste `github:openHacking/promotion` into the package field and click **Install**.
3. When installation finishes, click **Enable now**. Restart the client if prompted.
4. In a session, enter `/promotion` followed by your video brief.

Use the sidebar's Plugins page; the plugin inventory under Settings is read-only. See the [official client installation guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-plugin-manager/README.md#installing-a-bundle).

Alternatively, install into an existing Web profile from the command line:

```sh
dsh plugin --profile web add github:openHacking/promotion
dsh web
```

dsh downloads the bundle and installs its dependencies; no manual clone or build is required. The host supplies filesystem access, command execution, and skill loading. Tested host versions are `0.1.0-rc.6` and `0.2.0-rc.2`; client controls depend on the installed dsh version.

See [dsh installation](docs/installation.md#deepseek-harness-dsh) for version pinning, profile requirements, updates, and removal.

### Update a skill installation

Ask your agent to update Promotion from the same GitHub source. For local development installations, see [update instructions](docs/installation.md#updating).

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
- [MarkPress motion graphics example](examples/markpress-mg/README.md)
- [Contribute](CONTRIBUTING.md)

## License

Original code is MIT. Fonts, dependencies, external music, and captured product imagery retain their respective rights. Product names and historical example screenshots retain their respective rights. MarkPress motion artwork is an illustrative reconstruction of verified capabilities. See [third-party notices](THIRD_PARTY_NOTICES.md).

## Motion graphics

[Three editable MG starters](examples/mg-templates) combine orbital selection, spring type/object regrouping, and staggered strip reveals. Read [MG route and limits](references/motion-graphics.md). Initialize with `python3 scripts/example.py new-project --variant mg`.

## Rhythm, continuity and native formats

[The core MarkPress example](examples/markpress-mg/README.md) uses full motion graphics: kinetic type, syntax scanning, document transformation, spatial card choreography, and a stable closing action. Watch [landscape](examples/markpress-mg/video.mp4), [portrait](examples/markpress-mg/portrait-video.mp4), or [three direction studies](examples/markpress-mg/treatments/index.html). Listening remains an explicit outstanding review gate.
