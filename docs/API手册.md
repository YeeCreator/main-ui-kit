# API手册

## 1. `@main-ui-kit/core`

### 1.1 Schema

1. `SceneNodeSchema`
- 字段：`id`、`type`、`x`、`y`。

2. `SceneDocumentSchema`
- 字段：`version`、`sceneId`、`mode`、`nodes`、`modeExtensions`。

3. `CommandPayloadSchema`
- 字段：`commandId`、`payload`、`timestamp`。

4. `PluginManifestSchema`
- 字段：`id`、`name`、`version`、`dependencies`。

5. `ExportBundleSchema`
- 字段：`scene`、`level`、`entities`、`metadata.version`、`metadata.exportedAt`。

### 1.2 工厂函数

1. `createSceneStore(options)`
- 参数：
- `options.document: SceneDocument`
- `options.historyLimit?: number`（默认 `100`）
- 返回：`SceneStore`

2. `createCommandBus(store)`
- 参数：`store: SceneStore`
- 返回：`CommandBus`

3. `createPluginRegistry()`
- 返回：`PluginRegistry`

4. `createSceneKitCore(options)`
- 参数：
- `options.appId: string`
- `options.initialDocument?: Partial<SceneDocument>`
- 返回：`SceneKitCore`

### 1.3 主要接口

1. `SceneStore`
- `getSnapshot()`
- `setDocument(document)`
- `setNodes(nodes)`
- `setSelection(selection)`
- `setLastCommandId(commandId)`
- `undo()`
- `redo()`
- `clearHistory()`

2. `CommandBus`
- `register(commandId, handler)`
- `execute(command)`
- `undo()`
- `redo()`

3. `PluginRegistry`
- `register(plugin)`
- `activate(pluginId)`
- `deactivate(pluginId)`
- `unregister(pluginId)`
- `list()`

4. `SceneKitCore`
- `boot()`
- `dispose()`
- `getDocument()`
- `getStore()`
- `getCommandBus()`
- `getPluginRegistry()`

## 2. `@main-ui-kit/host-web`

### 2.1 `createWebHostAdapter(core)`

- 参数：`core: SceneKitCore`
- 返回：`WebHostAdapter`

### 2.2 `WebHostAdapter`

1. 属性
- `capability.storage`
- `capability.fileIO`

2. 方法
- `registerCommand(commandId, handler)`
- `dispatch(commandId, payload?)`
- `saveToStorage(key, document?)`
- `loadFromStorage(key)`
- `downloadJson(fileName, value)`
- `openJson()`

## 3. `@main-ui-kit/mode-canvas`

### 3.1 runtime 入口

1. `createCanvasRuntime(store)`
2. `registerCanvasCommands(commandBus, runtime)`
3. `createCanvasMode(options?)`

### 3.2 命令 ID

1. `CanvasCommandIds.createObject` = `canvas.object.create`
2. `CanvasCommandIds.moveObject` = `canvas.object.move`
3. `CanvasCommandIds.setSelection` = `canvas.selection.set`

### 3.3 pixi 入口

1. `CanvasPixiStage(props)`
- `props.width: number`
- `props.height: number`
- `props.nodes: SceneNode[]`
- `props.selection: string[]`

## 4. `@main-ui-kit/mode-map`

### 4.1 runtime 入口

1. `createMapViewportAdapter(initialState?)`
2. `registerMapCommands(commandBus, viewport)`
3. `createMapMode(options?)`

### 4.2 相机类型

1. `CameraState`
- `x`、`y`、`zoom`、`minZoom`、`maxZoom`、`bounds?`

2. `CameraBounds`
- `minX`、`maxX`、`minY`、`maxY`

### 4.3 命令 ID

1. `MapCommandIds.panCamera` = `map.camera.pan`
2. `MapCommandIds.zoomCamera` = `map.camera.zoom`
3. `MapCommandIds.setBounds` = `map.camera.bounds`

### 4.4 pixi 入口

1. `PixiViewportStage(props)`
- `props.width: number`
- `props.height: number`
- `props.viewportAdapter: MapViewportAdapter`
- `props.camera: CameraState`
- `props.onCameraChange?: (camera: CameraState) => void`

## 5. `@main-ui-kit/exporter`

1. `runExporter(document)`
- 参数：`document: SceneDocument`
- 返回：`ExportBundle`

2. `importSceneFromBundle(value)`
- 参数：`value: unknown`（支持 `ExportBundle` 或 `SceneDocument`）
- 返回：`SceneDocument`

## 6. `@main-ui-kit/shared-ui`

1. `PanelShell(props)`
- `props.title: string`
- `props.children: ReactNode`
