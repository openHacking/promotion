# Installation and migration

## Codex

Install directly from GitHub without manually cloning the repository:

```sh
npx skills add openHacking/promotion --skill promotion -g
```

Select Codex in the CLI, then start a fresh agent session. You can also ask your agent to install the Promotion skill from `https://github.com/openHacking/promotion`.

### Local development installation

For a checkout you maintain locally, run `python3 scripts/install.py`. The default destination is `$CODEX_HOME/skills/promotion`, or `~/.codex/skills/promotion` when unset. Use `--destination /path/to/agent/skills/promotion` for another local skill-enabled agent.

The installer excludes Git metadata, dependencies, build output, and caches. It does not install Node packages or change agent configuration. Start a fresh agent session after installation.

## DeepSeek Harness (dsh)

Promotion also ships as the native `dsh-promotion` bundle. It contributes a packaged skill provider to the host's existing `ctx.skills` registry. The instructions remain in the root `SKILL.md`; scripts, templates, fonts, music, references, and examples are local resources relative to that file.

Tested versions: `0.1.0-rc.6` and `0.2.0-rc.2`. Node.js 22+ and pnpm are required for the dsh CLI. See the official [bundle installation guide](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish).

### Install in the client

1. Open **Plugins** in the client sidebar, then click **Add plugin**. The menu's **Install a third-party plugin** action opens the same dialog.
2. Enter `github:openHacking/promotion` in the package field. Enter only the package spec, without the `dsh plugin add` command.
3. Click **Install** and wait for it to finish. **Show install details** displays the package-manager output if needed.
4. Click **Enable now**. Closing the dialog instead leaves the bundle installed but disabled; enable it from its card later.
5. Restart the client if it reports that a restart is required, then use `/promotion` followed by your video brief in a session.

Use the sidebar's Plugins page, not the read-only plugin inventory in Settings. The page manages the current application's profile, so no CLI profile name is needed. If the page is unavailable, the host may not have a managed profile or this client version may not provide the manager. See the [official client installation guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-plugin-manager/README.md#installing-a-bundle).

The GitHub revision must contain Promotion's plugin files. These steps are based on the official client documentation; the automated compatibility checks exercise the host registry and CLI, not client clicks.

### Install from the command line

For an existing Web profile, install directly from GitHub:

```sh
dsh plugin --profile web add github:openHacking/promotion
dsh --profile web --dump-config
dsh web
```

Use the profile belonging to the application you run; a plugin installed into a separate profile will not appear in the current client. For a fresh Web setup, run `dsh --profile web --dump-config` before installing to initialize the shipped Web profile. The config dump after installation should show a `dsh-promotion` layer and a `promotion` plugin row. In a session, enter `/promotion Create a 30-second product launch video for this project.` The model can also discover and load `promotion` through the host's skill tool.

dsh downloads the package and installs its runtime dependencies. You do not need to clone the repository, run `npm ci` at its root, or build the plugin. The entry point is native JavaScript with no `prepare` script or build authorization requirement. The selected GitHub revision must contain the plugin manifest and entry point.

To pin a revision, replace `<commit>` with the desired commit:

```sh
dsh plugin --profile web add 'github:openHacking/promotion#<commit>'
```

### Local development and archive distribution

Developers working from a checkout can install its runtime dependencies and link it into an existing Web profile:

```sh
npm ci
dsh plugin --profile web add .
```

To distribute an archive from a checkout:

```sh
npm pack
dsh plugin --profile web add ./dsh-promotion-0.1.0.tgz
```

The archive includes the existing example media and source archives, so it is large. It excludes `node_modules`, render output directories, caches, and private analysis. Installing the plugin does not install the video projects' dependencies; run `npm ci` inside each initialized video project as usual.

### Profile requirements

The bundle injects `skills` and registers only its provider. Standard dsh compositions supply the skill registry and the model-facing consumer. A custom composition needs `@deepseek-ai/dsh-skill` and `@deepseek-ai/dsh-tool-skill` (with its required agent and tool services). Add those through the composition's normal configuration if absent. Filesystem and command tools are needed to create and render video projects. The bundle does not add or replace those services, configure a model, or enable optional image/video providers.

The packaged skill uses rank 600 (`bundled`) in the host registry. Within the same scope layer, project and user skills with the same name take precedence. The host's scope-layer rules still apply. Disabling or removing the plugin disposes its provider; it never copies files into another agent's skill directory.

### Update and remove

In the client, the plugin card's uninstall action removes the bundle after confirmation. To update through the client, uninstall it and install the desired GitHub revision again. For a CLI-managed GitHub installation, install the desired commit and restart dsh:

```sh
dsh plugin --profile web add 'github:openHacking/promotion#<commit>'
```

For a tarball installation, run `dsh plugin --profile video add` with the new archive. For a linked development checkout, pull the desired revision and run `npm ci`. Restart dsh after updating.

```sh
dsh plugin --profile web remove dsh-promotion
```

This removes the dependency and its bundle layer. Independently created video projects remain in their own folders.

## Skills CLI

Install directly with `npx skills add openHacking/promotion --skill promotion -g` and select your agent in the CLI. Developers with a local checkout can use `npx skills add . --skill promotion -g`.

## Updating

Run `python3 scripts/install.py --replace` from the new checkout. Existing installations are backed up outside the skills directory before replacement. An installation failure restores the previous destination.

## Migrating from the previous name

The installer recognizes the previous `video-create` installation when it has the expected skill metadata. It archives that copy outside the active skill catalog, then installs Promotion. It refuses ambiguous legacy folders rather than deleting unrelated skills. Previous standalone video projects remain usable; `VIDEO_CREATE_BROWSER` remains a browser-environment alias.

## Runtime

Install Python 3, Node.js 22+, FFmpeg/FFprobe, and Chrome/Chromium. These are separate from skill installation. Run `npm ci` inside each initialized video project. No image-generation provider or paid video service is mandatory.

## Uninstall

Remove the installed `promotion` folder after preserving any needed local changes. Standalone production folders and installer backups are independent. Never remove another skill to uninstall Promotion.
