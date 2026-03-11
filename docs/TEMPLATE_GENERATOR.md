# Main UI Kit 模板生成器

## 定位

`main-ui-kit` 当前阶段聚焦为“工作台模板生成器 + 布局元素库”。

本轮交付内容覆盖以下方向：

1. `ide-workbench` 主模板。
2. `pnpm mui-template init` 命令行入口。
3. 元素开关、主区域模式、标签内容类型、设置页与快捷键页模板。
4. 两套预设：`preset-math-whiteboard` 与 `preset-game-workbench`。

## 使用命令

```bash
pnpm mui-template init demo-workbench --preset=preset-math-whiteboard
pnpm mui-template init demo-game-workbench --preset=preset-game-workbench
pnpm mui-template init custom-workbench --config=./main-ui.template.json
```

## 配置参数

```ts
type WorkbenchElementFlags = {
  menubar?: boolean
  toolbar?: boolean
  activitybar?: boolean
  leftSidebar?: boolean
  rightSidebar?: boolean
  bottomPanel?: boolean
  statusbar?: boolean
  settingsPage?: boolean
  keybindingsPage?: boolean
}

type MainAreaMode = 'single' | 'split' | 'tabs' | 'split-tabs'

type TabContentType = 'text-editor' | 'viewport-2d' | 'viewport-3d' | 'custom'

type MainUiTemplateConfig = {
  appId: string
  template: 'ide-workbench'
  mainAreaMode: MainAreaMode
  allowSplit: boolean
  allowTabs: boolean
  defaultTabContent: TabContentType
  enabledTabContents: TabContentType[]
  elements: WorkbenchElementFlags
  viewport: {
    engine2d?: 'none' | 'pixi' | 'konva' | 'custom'
    engine3d?: 'none' | 'three' | 'custom'
  }
}
```

## 预设说明

### preset-math-whiteboard

1. 主区域模式：`split-tabs`
2. 默认标签：`viewport-2d`
3. 内容类型：`text-editor`、`viewport-2d`、`custom`
4. 典型用途：数学白板、二维编辑器、草图工具台

### preset-game-workbench

1. 主区域模式：`split-tabs`
2. 默认标签：`viewport-3d`
3. 内容类型：`text-editor`、`viewport-2d`、`viewport-3d`、`custom`
4. 典型用途：小游戏编辑台、规则实验台、混合 2D/3D 工具台

## 生成结果

生成器会输出以下核心文件：

1. `main-ui.template.json`：模板配置快照。
2. `src/generated/templateConfig.ts`：供前端运行时直接引用的类型安全配置导出。
3. `src/workbench/WorkbenchShell.tsx`：可继续挂接真实业务视图的工作台壳层。

## 扩展方式

1. 替换文本编辑器占位区域为 Monaco、CodeMirror 或私有编辑器组件。
2. 将 2D / 3D 占位区域替换为 Pixi、Konva、Three 或私有视口实现。
3. 在工具条、活动栏和侧栏注入业务命令、导航树、资源面板、属性面板。
4. 在设置页和快捷键页的表格层替换为真实配置源与命令注册表。
