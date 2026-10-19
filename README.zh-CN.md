# Promotion

[English](README.md) | [简体中文](README.zh-CN.md)

**把你的产品，做成让人看得懂的视频。**

Promotion 是一个 Agent Skill，可以根据网站、项目目录、截图或录屏，制作可编辑的产品发布视频、软件演示和工作流宣传片。Agent 负责设计叙事、编排产品动效、同步声音，并在本地渲染 MP4。

[![MarkPress — Make ideas move](examples/markpress-mg/cover.png)](examples/markpress-mg/video.mp4)

**[浏览在线作品集](https://openhacking.github.io/promotion/)** · [观看 30 秒 MarkPress 示例](examples/markpress-mg/video.mp4) · [查看示例验证记录](examples/markpress-mg/README.md)

GitHub 可能将 MP4 显示为下载链接。本地作品集支持直接播放视频。

[![源码检查](https://github.com/openHacking/promotion/actions/workflows/check.yml/badge.svg)](https://github.com/openHacking/promotion/actions/workflows/check.yml)
[![作品集部署](https://github.com/openHacking/promotion/actions/workflows/pages.yml/badge.svg)](https://github.com/openHacking/promotion/actions/workflows/pages.yml)

## 安装

在 Codex 等支持 Skill 的 Agent 中，可以直接说：

> 从 https://github.com/openHacking/promotion 安装 Promotion 技能。

也可以通过 Skills CLI 直接从 GitHub 安装，无需手动拉取源码：

```sh
npx skills add openHacking/promotion --skill promotion -g
```

在 CLI 中选择你使用的 Agent。如果技能列表没有自动刷新，请开启新会话。

本地开发、其他 Agent 和旧版本迁移方式，见[安装与迁移文档（英文）](docs/installation.md)。

### DeepSeek Harness（dsh）

直接在 dsh 客户端内安装：

1. 打开侧边栏的「插件」（Plugins），点击「添加插件」（Add plugin）。
2. 在输入框粘贴 `github:openHacking/promotion`，点击「安装」（Install）。
3. 安装完成后，点击「立即启用」（Enable now）。如提示需要重启，请重启客户端。
4. 在会话中输入 `/promotion`，后面写上你的视频需求。

请使用侧边栏的插件页面；「设置」中的插件清单是只读的。具体操作见 [dsh 官方客户端安装指南（英文）](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-plugin-manager/README.md#installing-a-bundle)。

也可以通过命令行安装到已有的 Web profile：

```sh
dsh plugin --profile web add github:openHacking/promotion
dsh web
```

dsh 会下载插件包并安装依赖，无需手动拉取源码或构建插件。宿主提供文件访问、命令执行和技能加载能力。已验证的宿主版本为 `0.1.0-rc.6`、`0.2.0-rc.2` 和 `0.2.1-rc.2`；客户端按钮和入口随版本而异。

版本固定、profile 要求、更新和卸载方式，见 [dsh 安装文档（英文）](docs/installation.md#deepseek-harness-dsh)。

### 更新技能

让 Agent 从同一个 GitHub 地址更新 Promotion 即可。本地开发安装的更新方式，见[更新说明（英文）](docs/installation.md#updating)。

## 试一试

以下 `$promotion` 示例适用于支持这种技能调用语法的 Agent；在 dsh 中请使用 `/promotion`。

**从网站开始**

> 使用 $promotion，为 https://saashunt.pro/ 制作一支 30 秒的产品发布视频。展示发现产品的过程，使用英文文案，让动效活泼，同时保持界面清晰可读。请自主决定创意方向并完成视频。

**从项目开始**

> 对这个项目使用 $promotion。先了解产品的真实能力，展示合适的动画模板，并在制作前推荐一个方向。

**选择模板**

> 使用 $promotion 的 workflow 模板，把这些截图制作成一支 40 秒的产品演示视频。使用我们的品牌色和中文字幕。

**一起创作**

> 使用 $promotion 的协作模式，先为产品发布视频提出视觉方向和完整分镜。我们确认后，再完成视频制作和审查。

**修改已有视频**

> 把开头加快，让结果画面停留更久，并弱化背景。让关键动作与音乐对齐，然后重新渲染视频。

## 三种创作方式

| 模式 | 你需要参与什么 |
|---|---|
| 模板模式 | 选择一个起始结构，Agent 根据你的产品进行改编。 |
| 自主模式 | 给出目标和约束，Agent 负责完整制作流程。 |
| 协作模式 | 先确认视觉方向和分镜，再进入制作。 |

你可以提供参考视频，也可以直接从需求开始。Agent 会先考虑如何通过画面解释产品，再写宣传文案。当图像生成能力能改善主体、环境或概念探索时，可以使用它；准确的界面和文字仍保留为独立图层。自由编排的场景可以结合真实界面、生成图像、视频和代码动效，不要求每个画面都有标题或浏览器边框。

## 动画起点

| 模板 | 适合的产品或场景 | 动画结构 |
|---|---|---|
| Minimal launch | 应用、设计工具、新产品 | 品牌 → 主视觉 → 功能卡片 → 产品聚焦 |
| Window demo | 桌面软件、Agent、开发者工具 | 意图 → 工作区 → 操作 → 结果 |
| Quick command | 搜索、启动器、快捷操作 | 输入命令 → 选择 → 即时结果 |
| Workflow cards | SaaS、自动化、协作 | 输入 → 连贯步骤 → 完成输出 |
| Continuous discovery | 产品目录、发现产品的流程 | 卡片 → 真实目录 → 分类 → 详情 → 网站价值 |

品牌、界面、文案、配色、字体、时间安排和声音都可以替换。自由创作也可以重新设计整套动作编排。

如果已有本地源码，可以启动作品集：

```sh
node scripts/serve.mjs . 5207
```

打开 [http://127.0.0.1:5207/assets/gallery/index.html](http://127.0.0.1:5207/assets/gallery/index.html)。

## 你会得到什么

一支带声音的 MP4、封面、分镜、配乐、可编辑源码项目、构建命令和审查报告。默认使用英文、1080p、60fps、约 40 秒时长，不含旁白；可以指定其他语言和时长。竖屏需要单独调整构图，不能直接拉伸横屏画面。

## 运行要求

需要具备本地文件访问和命令执行能力的编程 Agent，以及 Python 3、Node.js 22+、FFmpeg/FFprobe 和 Chrome/Chromium。不要求付费生成服务。Remotion 和可选第三方组件遵循各自许可证，见[第三方声明（英文）](THIRD_PARTY_NOTICES.md)。

首次使用时，Agent 会安装视频项目依赖。如果下载的浏览器无法启动，可以通过 `PROMOTION_BROWSER` 指定本机 Chrome，见[故障排查（英文）](docs/troubleshooting.md)。

## 文档

以下详细文档目前为英文：

- [安装、更新与迁移](docs/installation.md)
- [使用 Promotion](docs/usage.md)
- [编辑与重新构建项目](docs/project-guide.md)
- [架构](docs/architecture.md)
- [动效与声音设计](references/motion-design.md)
- [质量检查与验证证据](references/quality.md)
- [已执行的验证](references/validation.md)
- [MarkPress 动态图形示例](examples/markpress-mg/README.md)
- [参与贡献](CONTRIBUTING.md)

## 许可证

原创代码使用 MIT 许可证。字体、依赖、外部音乐和采集的产品图像保留各自权利；产品名称和历史示例截图同样如此。MarkPress 动态图形是基于已核实能力的示意性重建。详见[第三方声明（英文）](THIRD_PARTY_NOTICES.md)。

## 动态图形

[三个可编辑 MG 起点](examples/mg-templates)分别结合环绕选择、弹性文字与对象重组、交错条带揭示。适用方式和限制，见 [MG 指南（英文）](references/motion-graphics.md)。初始化命令：

```sh
python3 scripts/example.py new-project --variant mg
```

## 节奏、连续性与原生画幅

[核心 MarkPress 示例](examples/markpress-mg/README.md)采用完整的动态图形编排：动态文字、语法扫描、文档转换、空间卡片运动，以及稳定的收尾动作。可以观看[横屏版](examples/markpress-mg/video.mp4)、[竖屏版](examples/markpress-mg/portrait-video.mp4)或[三种方向研究](examples/markpress-mg/treatments/index.html)。该示例的实际听审仍待完成。
