# API手册

## `@main-ui-kit/core`

### `SceneDocumentSchema`

- 说明：场景文档的基础校验 Schema。
- 关键字段：
- `version`: 协议版本，默认 `1.0.0`。
- `sceneId`: 场景唯一标识。
- `mode`: 当前模式标识。
- `nodes`: 节点数组。

### `createSceneKitCore(options)`

- 说明：创建内核实例。
- 参数：
- `options.appId`: 应用标识。
- `options.initialDocument`: 可选的初始场景文档。
- 返回：`SceneKitCore`

### `SceneKitCore`

- `boot()`: 启动内核。
- `dispose()`: 释放内核资源。
- `getDocument()`: 获取当前场景文档快照。

## `@main-ui-kit/host-web`

### `createWebHostAdapter(core)`

- 说明：创建 Web 宿主适配器。
- 参数：
- `core`: 内核实例。
- 返回：`WebHostAdapter`

### `WebHostAdapter`

- `registerCommand(commandId, handler)`: 注册命令处理器。
- `dispatch(commandId)`: 触发命令。
- `saveToStorage(key)`: 将场景文档保存到本地存储。
- `loadFromStorage(key)`: 从本地存储读取场景文档。

## `@main-ui-kit/mode-canvas`

### `createCanvasMode()`

- 说明：创建 Canvas 模式定义。
- 返回：`ModeDefinition`

## `@main-ui-kit/mode-map`

### `createMapMode()`

- 说明：创建 Map 模式定义。
- 返回：`ModeDefinition`

## `@main-ui-kit/exporter`

### `runExporter(document)`

- 说明：执行导出流程，生成场景与元信息产物。
- 参数：
- `document`: 已校验的场景文档。
- 返回：`ExportBundle`

## `@main-ui-kit/shared-ui`

### `PanelShell(props)`

- 说明：基础面板容器组件。
- 参数：
- `props.title`: 面板标题。
- `props.children`: 面板内容。
