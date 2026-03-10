# main-ui-kit

`main-ui-kit` 是基于 `scene-kit` 方案的 monorepo 工程。

## 当前阶段

1. 已完成 M0 工程初始化。
2. 已创建 `apps/web-host` 与 `packages/*` 基础包骨架。
3. 已接入 CI（`lint/typecheck/test/build`）。

## 目录结构

```text
apps/
  web-host/
packages/
  core/
  host-web/
  mode-canvas/
  mode-map/
  exporter/
  shared-ui/
docs/
```

## 常用命令

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 文档入口

1. 产品设计：`.github/docs/memos/memos-main-ui-kit-product-design-20260310-001.md`
2. 实施方案：`.github/docs/plan/plan-main-ui-kit-product-implementation-20260310-001.md`
3. API 手册：`docs/API手册.md`
