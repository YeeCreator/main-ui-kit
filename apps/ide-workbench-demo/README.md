# Preset Math Whiteboard

该项目由 `main-ui-kit` 模板生成器创建。

## 预设

- 当前预设：`preset-math-whiteboard`

## 启动

```bash
pnpm install
pnpm dev
```

## 升级托管壳层

```bash
pnpm mui-template upgrade-shell ./apps/ide-workbench-demo
pnpm mui-template upgrade-shell ./apps/ide-workbench-demo --yes
```

## 配置

- 主配置文件：`main-ui.template.json`
- 运行时导出：`src/generated/templateConfig.ts`

### Dock 模式示例

```json
{
	"mainAreaMode": "dock",
	"docking": {
		"persistLayout": true,
		"layoutStorageKey": "main-ui-kit:dock-layout:v1:ide-workbench-demo"
	}
}
```

## 可扩展点

- `src/workbench/WorkbenchShell.tsx`：工作台壳层。
- `src/generated/templateConfig.ts`：生成器输出配置。
- `src/App.tsx`：业务入口，可继续挂接真实编辑器、2D/3D 视口或自定义插件视图。
