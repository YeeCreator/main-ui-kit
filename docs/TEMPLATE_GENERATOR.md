# Main UI Kit 模板生成器

## 定位

`main-ui-kit` 当前阶段聚焦为“工作台模板生成器 + 布局元素库”。

默认交付策略采用：**壳层托管 + 内容剥离**。

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
pnpm mui-template upgrade-shell ./demo-workbench
pnpm mui-template upgrade-shell ./demo-workbench --yes
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

type TabContentType = 'text-editor' | 'viewport-2d' | 'viewport-3d' | 'custom' | 'flow-canvas'

type MainUiTemplateConfig = {
  appId: string
  template: 'ide-workbench'
  mainAreaMode: MainAreaMode
  allowSplit: boolean
  allowTabs: boolean
  deliveryModel: {
    shell: 'managed'
    content: 'detached'
  }
  defaultTabContent: TabContentType
  enabledTabContents: TabContentType[]
  elements: WorkbenchElementFlags
  viewport: {
    engine2d?: 'none' | 'pixi' | 'konva' | 'custom'
    engine3d?: 'none' | 'three' | 'custom'
  }
}
```

## 交付模型（重要）

### 1) 壳层托管层（Managed Shell Layer）

范围：

1. 工作台骨架（菜单栏、工具条、活动栏、侧栏、底部面板、状态栏）
2. 主区域布局引擎与标签页框架
3. 设置页与快捷键页基础模板

策略：

1. 以工具包依赖方式供用户项目引用。
2. 支持版本升级与热更新。
3. 升级时优先保证壳层兼容与回归可验证。

### 2) 内容剥离层（Detached Content Layer）

范围：

1. 主区域第三方内容模块（例如 x6、Monaco、Three）
2. 业务私有视图与面板
3. 项目特定命令与数据结构

策略：

1. 模板初始化时一次性写入用户仓库。
2. 交付后默认由用户自行魔改与维护。
3. 工具包提供迁移指南与可选脚本，不强制覆盖用户改动。

### 3) 可托管插件包（可选升级路径）

仅当第三方内容模块满足以下条件时建议升级为可托管插件包：

1. API 已稳定（连续两个小版本无破坏性变更）。
2. 在至少两个独立项目中可复用。
3. 可配置边界清晰，不强耦合业务域模型。
4. 具备独立测试与版本发布能力。

## 预设说明

### preset-math-whiteboard

1. 主区域模式：`split-tabs`
2. 默认标签：`flow-canvas`
3. 内容类型：`text-editor`、`viewport-2d`、`flow-canvas`、`custom`
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
3. `src/managed/workbench-shell/WorkbenchShell.tsx`：托管壳层入口。
4. `src/managed/settings-keybindings/sampleData.ts`：托管设置页/快捷键页示例数据。
5. `src/detached/integrations/x6/X6FlowCanvas.tsx`：剥离层 x6 最小示例。
6. `src/detached/content/DetachedContentRouter.tsx`：剥离层内容路由。

## 扩展方式

1. 替换文本编辑器占位区域为 Monaco、CodeMirror 或私有编辑器组件。
2. 将 2D / 3D 占位区域替换为 Pixi、Konva、Three 或私有视口实现。
3. 在工具条、活动栏和侧栏注入业务命令、导航树、资源面板、属性面板。
4. 在设置页和快捷键页的表格层替换为真实配置源与命令注册表。

## 升级建议

1. 壳层升级：执行 `pnpm mui-template upgrade-shell <目录>` 先 dry-run，再用 `--yes` 写入。
2. 内容升级：通过对比模板变更说明手动选择性合并。
3. 涉及第三方模块（如 x6）时，建议将“基础适配层”与“业务魔改层”分目录管理，降低后续合并成本。
4. 升级报告输出到 `main-ui.template.upgrade-report.json`，包含新增/更新/冲突/跳过明细。

## W4 评审通道

1. 评审任务模板：`.github/docs/tasks/task-main-ui-kit-managed-plugin-review-channel-20260312-001.md`
2. x6 评审演练报告：`.github/docs/report/report-main-ui-kit-managed-plugin-review-drill-x6-20260312-001.md`
3. 当前结论：x6 暂不升级为托管插件包，保持在 `src/detached/**`。

## W5 回归清单

1. 回归清单文档：`.github/docs/tasks/task-main-ui-kit-template-migration-regression-checklist-20260312-001.md`
2. 最小回归命令序列：

```bash
pnpm mui-template init demo-workbench --preset=preset-math-whiteboard --force
pnpm mui-template upgrade-shell demo-workbench
pnpm mui-template upgrade-shell demo-workbench --yes
pnpm --dir demo-workbench install --ignore-workspace
pnpm --dir demo-workbench build
```
