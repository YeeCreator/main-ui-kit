# main-ui-kit

`main-ui-kit` 当前阶段定位为“工作台模板生成器 + 布局元素库”，目标是让业务团队快速生成一套可运行、可扩展、可配置的 IDE 风格工作台骨架。

## 当前能力

1. `pnpm mui-template init` 模板生成器 CLI。
2. `ide-workbench` 主模板。
3. 元素开关：菜单栏、工具条、活动栏、左右侧栏、底部面板、状态栏、设置页、快捷键页。
4. 主区域模式：`single`、`split`、`tabs`、`split-tabs`、`dock`。
5. 标签内容类型：`text-editor`、`viewport-2d`、`viewport-3d`、`custom`、`flow-canvas`。
6. 三套预设：`preset-math-whiteboard`、`preset-game-workbench`、`preset-math-dock-workbench`。
7. 双层交付模型：`deliveryModel.shell=managed`、`deliveryModel.content=detached`。
8. 托管壳层升级命令：`pnpm mui-template upgrade-shell <目录> [--yes]`。

## 本地预览

```bash
pnpm install
pnpm dev
```

启动后，根应用会展示仓库内置的工作台模板预览页，可直接切换预设、布局模式和元素开关。

## 生成模板工程

```bash
pnpm mui-template init demo-workbench --preset=preset-math-whiteboard
pnpm mui-template init demo-game-workbench --preset=preset-game-workbench
pnpm mui-template init demo-dock-workbench --preset=preset-math-dock-workbench
pnpm mui-template init custom-workbench --config=./main-ui.template.json
```

## 目录说明

1. `packages/template-generator`：模板生成器 CLI 与预设。
2. `templates/ide-workbench`：生成器复制用的工作台模板源。
3. `src/workbench`：仓库内预览应用使用的工作台预览组件。
4. `docs/TEMPLATE_GENERATOR.md`：参数、预设与扩展说明。

## 后续扩展建议

1. 将占位视口替换为真实 2D / 3D 引擎实现。
2. 将设置页与快捷键页接入真实配置源和命令注册表。
3. 若需要更复杂的拖拽停靠能力，再引入专业 docking 布局库。

