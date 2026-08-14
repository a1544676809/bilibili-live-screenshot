# bilibili-live-screenshot

Bilibili-Evolved 直播页截图组件：在直播间播放器控制栏添加截图按钮，一键截取当前直播画面。

## 功能

- 直播播放器控制栏（`.left-area`）新增截图按钮，点击即截取当前画面
- 截图后在播放器右上角显示缩略图列表，支持：
  - 单张保存 / 复制到剪贴板 / 丢弃
  - 全部保存为 zip / 全部丢弃
- 页面有未保存截图时，关闭页面会弹确认提示
- 文件名自动包含直播标题与截图时间（`直播标题 @HH-MM-SS 时间戳.png`）

## 在线部署（Bilibili-Evolved 在线组件）

组件以单文件 UMD 形式构建，可直接被 Bilibili-Evolved 的「在线组件」功能加载：

```
https://raw.githubusercontent.com/a1544676809/bilibili-live-screenshot/main/dist/live-screenshot.js
```

在 Bilibili-Evolved 设置 → 在线组件 → 添加，粘贴上述地址即可。
构建产物在 `dist/` 目录，每次发布后请保持该目录与源码同步更新。

## 本地开发

```bash
pnpm install        # 安装依赖
pnpm build          # 构建到 dist/
pnpm type-check     # TypeScript 类型检查
```

### 作为 Bilibili-Evolved 组件使用

将 `registry/lib/components/live/live-screenshot/` 目录复制到 Bilibili-Evolved 仓库的
`registry/lib/components/live/` 下，构建 Bilibili-Evolved 即可集成（组件会被自动发现注册）。

## 目录结构

```
├── registry/lib/components/live/live-screenshot/   # 组件源码
│   ├── index.ts                                    # 组件入口（控制栏按钮插入逻辑）
│   ├── screenshot.ts                               # 截图核心（canvas 截取视频帧）
│   ├── VideoScreenshot.vue                         # 缩略图组件
│   ├── VideoScreenshotContainer.vue                # 截图列表容器
│   ├── live-screenshot.scss                        # 按钮样式
│   └── index.md                                    # 组件说明
├── types/                                          # 构建期类型声明（coreApis externals）
├── webpack.config.js                               # 独立构建配置
├── dist/                                           # 构建产物（在线组件加载用）
└── package.json
```

## 工作原理

- 通过 Bilibili-Evolved 提供的 `waitForControlBar` API 监听直播控制栏的创建（鼠标移入/移出会重建控制栏 DOM），配合定时轮询兜底，将截图按钮插入 `.control-area .left-area`
- 点击按钮后定位 `#live-player video` 元素，用 `canvas.drawImage` 截取当前视频帧，`toBlob` 生成 PNG 并通过 `URL.createObjectURL` 展示
- 所有 Bilibili-Evolved 核心 API（`coreApis`、`Vue` 等）均以 externals 方式在运行时提供，本组件不打包它们

## 许可证

[GPL-3.0](./LICENSE)

> 注意：本组件参考并改编自 [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)
> （MIT License，Copyright (c) Grant Howard 等）的 `video/player/screenshot` 组件代码。
> 原 MIT 许可声明保留在 Bilibili-Evolved 上游仓库中，本仓库以 GPL-3.0 重新发布。
