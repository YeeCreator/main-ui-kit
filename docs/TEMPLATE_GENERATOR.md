# Main UI Kit 模板生成器

## 定位

`main-ui-kit` 当前阶段聚焦为“工作台模板生成器 + 布局元素库”。

默认交付策略采用：**壳层托管 + 内容剥离**。

本轮交付内容覆盖以下方向：

1. `ide-workbench` 主模板。
2. `pnpm mui-template init` 命令行入口。
3. 元素开关、主区域模式、标签内容类型、设置页与快捷键页模板。
4. 三套预设：`preset-math-whiteboard`、`preset-game-workbench`、`preset-math-dock-workbench`。
5. Docking 灰度预设：`preset-math-dock-workbench`。

## 使用命令

```bash
pnpm mui-template init demo-workbench --preset=preset-math-whiteboard
pnpm mui-template init demo-game-workbench --preset=preset-game-workbench
pnpm mui-template init demo-dock-workbench --preset=preset-math-dock-workbench
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

type MainAreaMode = 'single' | 'split' | 'tabs' | 'split-tabs' | 'dock'

type TabContentType = 'text-editor' | 'viewport-2d' | 'viewport-3d' | 'custom' | 'flow-canvas'

type MainUiTemplateConfig = {
  appId: string
  template: 'ide-workbench'
  mainAreaMode: MainAreaMode
  allowSplit: boolean
  allowTabs: boolean
  docking: {
    persistLayout: boolean
    layoutStorageKey: string
  }
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

### preset-math-dock-workbench

1. 主区域模式：`dock`
2. 默认标签：`flow-canvas`
3. 内容类型：`text-editor`、`flow-canvas`、`custom`
4. 典型用途：流程图编辑台、图形化编排工作台、可二开的 Docking 工具宿主

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
4. 升级报告输出到 `main-ui.template.upgrade-report.json`，包含升级路径 `shellVersion.from -> shellVersion.to`。
5. 冲突分级采用 A/B/C：
  - A：可自动升级（同主版本或首次托管）
  - B：建议人工确认（跨主版本或版本标识异常）
  - C：禁止自动覆盖（缺少托管标识，疑似用户魔改）

## 阶段二升级策略（Plan 007）

1. 版本路径治理：升级报告必须包含 `from -> to`，并标注路径决策。
2. 冲突分级治理：优先处理 C 级，再处理 B 级，A 级可自动执行。
3. 先 dry-run 再写入：`upgrade-shell` 默认不写盘，建议先评估再执行 `--yes`。
4. 内容层保护：任何升级都不应改动 `src/detached/**`。

## Dock 模式迁移（Plan 008）

1. 从 `split-tabs` 迁移到 `dock`：将 `main-ui.template.json` 的 `mainAreaMode` 改为 `dock`。
2. 建议同时开启 `docking.persistLayout=true`，并指定 `docking.layoutStorageKey`。
3. 若需要快速回退，仅需将 `mainAreaMode` 改回 `split-tabs` 并重启模板工程。
4. Dock 模式下仍通过 `DetachedContentRouter` 渲染剥离层内容，业务魔改边界保持不变。
5. 当前 `dock` 为托管层最小运行时，已覆盖新建标签、拆分、移动、关闭与本地持久化；暂不包含拖拽停靠与分离窗口。

## 用户魔改建议目录规范

建议在剥离层按“三段式”组织，降低后续升级合并成本：

1. `src/detached/integrations/**`：第三方引擎基础适配（x6/Monaco/Three）。
2. `src/detached/business/**`：业务规则与领域组件。
3. `src/detached/content/**`：标签内容路由与装配。

建议实践：

1. 第三方适配层尽量保持薄封装，不直接耦合业务模型。
2. 业务魔改优先落在 `business/**`，避免改动适配层公共接口。
3. 标签路由只做装配，不承载复杂业务逻辑。

## 常见问题与故障排查（FAQ）

### Q1：`upgrade-shell` 没有写入任何文件

原因：默认是 dry-run。  
处理：追加 `--yes` 才会实际写入。

### Q2：报告中出现 B 级冲突

原因：常见于跨主版本升级或版本标识异常。  
处理：按报告逐项人工确认，必要时先备份目标托管文件再覆盖。

### Q3：报告中出现 C 级冲突

原因：目标文件缺少托管标识，疑似被用户魔改。  
处理：默认不要自动覆盖；手动对比模板源文件与本地魔改后再合并。

### Q4：x6 页面空白或加载失败

排查：

1. 确认模板工程依赖安装成功（`pnpm --dir <模板目录> install`）。
2. 确认 `@antv/x6` 依赖存在于模板 `package.json`。
3. 检查浏览器控制台是否有动态导入失败信息。

### Q5：升级后业务视图异常

排查：

1. 确认异常是否来自 `src/managed/**` 还是 `src/detached/**`。
2. 若来自剥离层，优先回滚业务魔改并分步恢复。
3. 若来自托管层，结合升级报告检查是否存在 B/C 级冲突未处理。

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
pnpm --dir demo-workbench install
pnpm --dir demo-workbench build
pnpm test:template-regression
```
