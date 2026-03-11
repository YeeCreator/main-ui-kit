# Preset Math Whiteboard

该项目由 `main-ui-kit` 模板生成器创建。

## 预设

- 当前预设：`preset-math-whiteboard`

## 启动

```bash
pnpm install
pnpm dev
```

## 配置

- 主配置文件：`main-ui.template.json`
- 运行时导出：`src/generated/templateConfig.ts`

## 可扩展点

- `src/workbench/WorkbenchShell.tsx`：工作台壳层。
- `src/generated/templateConfig.ts`：生成器输出配置。
- `src/App.tsx`：业务入口，可继续挂接真实编辑器、2D/3D 视口或自定义插件视图。
