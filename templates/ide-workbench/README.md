# __APP_TITLE__

该项目由 `main-ui-kit` 模板生成器创建。

## 预设

- 当前预设：`__PRESET_NAME__`

## 启动

```bash
pnpm install
pnpm dev
```

## 升级托管壳层

```bash
# 在 main-ui-kit 工具仓库根目录执行
pnpm mui-template upgrade-shell ./your-template-app
pnpm mui-template upgrade-shell ./your-template-app --yes
```

## 配置

- 主配置文件：`main-ui.template.json`
- 运行时导出：`src/generated/templateConfig.ts`

## 可扩展点

- `src/managed/workbench-shell/WorkbenchShell.tsx`：托管壳层。
- `src/detached/integrations/x6/X6FlowCanvas.tsx`：x6 内容剥离示例。
- `src/detached/business/BusinessPlaceholder.tsx`：业务剥离层占位。
- `src/generated/templateConfig.ts`：生成器输出配置。
- `src/App.tsx`：业务入口，可继续挂接真实编辑器、2D/3D 视口或自定义插件视图。
