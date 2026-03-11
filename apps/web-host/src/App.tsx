import { createSceneKitCore } from '@main-ui-kit/core';
import { importSceneFromBundle, runExporter } from '@main-ui-kit/exporter';
import { createWebHostAdapter } from '@main-ui-kit/host-web';
import { CanvasCommandIds, createCanvasMode } from '@main-ui-kit/mode-canvas/runtime';
import {
  type CameraState,
  createMapMode,
  createMapViewportAdapter,
  MapCommandIds,
} from '@main-ui-kit/mode-map/runtime';
import { lazy, Suspense, useMemo, useState } from 'react';
import { appLogger } from './logger';

const LazyPixiViewportStage = lazy(async () => {
  const module = await import('@main-ui-kit/mode-map/pixi');
  return { default: module.PixiViewportStage };
});

const LazyCanvasPixiStage = lazy(async () => {
  const module = await import('@main-ui-kit/mode-canvas/pixi');
  return { default: module.CanvasPixiStage };
});

/**
 * Web 宿主演示应用入口组件。
 * @returns 宿主页面内容。
 */
export function App() {
  const runtime = useMemo(() => {
    const core = createSceneKitCore({ appId: 'web-host-demo' });
    const host = createWebHostAdapter(core);
    const store = core.getStore();
    const commandBus = core.getCommandBus();
    const viewportAdapter = createMapViewportAdapter({ x: 2000, y: 2000, zoom: 0.6 });

    const canvasMode = createCanvasMode({ store, commandBus });
    const mapMode = createMapMode({ commandBus, initialCamera: { x: 2000, y: 2000, zoom: 0.6 } });

    commandBus.execute({
      commandId: CanvasCommandIds.createObject,
      payload: { id: 'demo-node', type: 'rect', x: 120, y: 80 },
    });
    commandBus.execute({
      commandId: CanvasCommandIds.setSelection,
      payload: { selection: ['demo-node'] },
    });
    commandBus.execute({ commandId: MapCommandIds.panCamera, payload: { dx: 24, dy: 16 } });

    return {
      core,
      host,
      store,
      commandBus,
      viewportAdapter,
      canvasMode,
      mapMode,
    };
  }, []);

  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState('就绪');
  const [camera, setCamera] = useState<CameraState>(() => runtime.viewportAdapter.getCamera());

  const snapshot = runtime.store.getSnapshot();
  const exportBundle = runExporter(runtime.core.getDocument());

  const refresh = (nextMessage: string): void => {
    setMessage(nextMessage);
    setRevision((value) => value + 1);
  };

  /**
   * 统一包装按钮操作，确保错误可见并写入日志。
   * @param actionName 操作名称。
   * @param handler 操作函数。
   */
  const runAction = (actionName: string, handler: () => void): void => {
    try {
      handler();
      appLogger.info(`操作成功: ${actionName}`);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : '未知错误';
      appLogger.error(`操作失败: ${actionName}`, error);
      refresh(`操作失败：${messageText}`);
    }
  };

  const handleCreateNode = (): void => {
    runAction('新增节点', () => {
      const nodeId = `node-${Date.now()}`;
      runtime.commandBus.execute({
        commandId: CanvasCommandIds.createObject,
        payload: {
          id: nodeId,
          type: 'rect',
          x: 100 + Math.floor(Math.random() * 320),
          y: 100 + Math.floor(Math.random() * 220),
        },
      });
      runtime.commandBus.execute({
        commandId: CanvasCommandIds.setSelection,
        payload: { selection: [nodeId] },
      });
      refresh(`已创建节点 ${nodeId}`);
    });
  };

  const handleSaveToStorage = (): void => {
    runAction('保存到本地', () => {
      runtime.host.saveToStorage('scene-kit:last', runtime.core.getDocument());
      refresh('已保存到 localStorage(scene-kit:last)');
    });
  };

  const handleLoadFromStorage = (): void => {
    runAction('从本地加载', () => {
      const document = runtime.host.loadFromStorage('scene-kit:last');
      if (!document) {
        refresh('未找到可加载的本地文档');
        return;
      }

      runtime.store.setDocument(document);
      refresh('已从 localStorage 加载文档');
    });
  };

  const handleExportBundle = (): void => {
    runAction('导出 JSON', () => {
      const bundle = runExporter(runtime.core.getDocument());
      runtime.host.downloadJson('scene-export.json', bundle);
      refresh('已导出 scene-export.json');
    });
  };

  const handleImportBundle = async (): Promise<void> => {
    try {
      const imported = await runtime.host.openJson();
      if (!imported) {
        refresh('已取消导入');
        return;
      }

      const document = importSceneFromBundle(imported);
      runtime.store.setDocument(document);
      appLogger.info('操作成功: 导入 JSON');
      refresh('已完成导入并更新场景');
    } catch (error) {
      const messageText = error instanceof Error ? error.message : '未知错误';
      appLogger.error('操作失败: 导入 JSON', error);
      refresh(`导入失败：${messageText}`);
    }
  };

  const handlePanCamera = (): void => {
    runAction('平移相机', () => {
      runtime.commandBus.execute({ commandId: MapCommandIds.panCamera, payload: { dx: 60, dy: 36 } });
      runtime.viewportAdapter.panBy(60, 36);
      setCamera(runtime.viewportAdapter.getCamera());
      refresh('已执行相机平移');
    });
  };

  const handleZoomCamera = (): void => {
    runAction('缩放相机', () => {
      const nextZoom = Math.min(2.4, camera.zoom + 0.2);
      runtime.commandBus.execute({ commandId: MapCommandIds.zoomCamera, payload: { zoom: nextZoom } });
      runtime.viewportAdapter.zoomTo(nextZoom);
      setCamera(runtime.viewportAdapter.getCamera());
      refresh(`已缩放到 ${nextZoom.toFixed(2)}`);
    });
  };

  return (
    <main className="app-shell">
      <h1 className="title">Scene-Kit Web Host</h1>
      <section className="card">
        <p>当前阶段：M2.1（Pixi 视口）+ M3（宿主与导出闭环）已接入。</p>
        <p>可用模式：{`${runtime.canvasMode.id}, ${runtime.mapMode.id}`}</p>
        <p>本地存储能力：{runtime.host.capability.storage ? '已启用' : '未启用'}</p>
        <p>文件读写能力：{runtime.host.capability.fileIO ? '已启用' : '未启用'}</p>
        <p data-testid="node-count">节点数量：{snapshot.document.nodes.length}</p>
        <p data-testid="selection-count">选区数量：{snapshot.selection.length}</p>
        <p>最近命令：{snapshot.lastCommandId ?? '无'}</p>
        <p>相机：({camera.x.toFixed(1)}, {camera.y.toFixed(1)}) / zoom {camera.zoom.toFixed(2)}</p>
        <p>导出版本：{exportBundle.metadata.version}</p>
        <p>状态：{message}</p>
      </section>

      <section className="card toolbar" key={revision}>
        <button data-testid="btn-create-node" type="button" onClick={handleCreateNode}>新增节点</button>
        <button data-testid="btn-pan-camera" type="button" onClick={handlePanCamera}>平移相机</button>
        <button data-testid="btn-zoom-camera" type="button" onClick={handleZoomCamera}>缩放相机</button>
        <button data-testid="btn-save" type="button" onClick={handleSaveToStorage}>保存到本地</button>
        <button data-testid="btn-load" type="button" onClick={handleLoadFromStorage}>从本地加载</button>
        <button data-testid="btn-export" type="button" onClick={handleExportBundle}>导出 JSON</button>
        <button data-testid="btn-import" type="button" onClick={() => void handleImportBundle()}>导入 JSON</button>
      </section>

      <section className="card viewport-card">
        <h2>Canvas 图元视图</h2>
        <Suspense fallback={<p>Canvas 视图加载中...</p>}>
          <LazyCanvasPixiStage
            width={960}
            height={320}
            nodes={snapshot.document.nodes}
            selection={snapshot.selection}
          />
        </Suspense>
      </section>

      <section className="card viewport-card">
        <h2>Map 视口</h2>
        <Suspense fallback={<p>Pixi 视口加载中...</p>}>
          <LazyPixiViewportStage
            width={960}
            height={480}
            viewportAdapter={runtime.viewportAdapter}
            camera={camera}
            onCameraChange={setCamera}
          />
        </Suspense>
      </section>

      <section className="card">
        <h2>导出预览</h2>
        <pre data-testid="export-json-preview" className="json-preview">
          {JSON.stringify(exportBundle, null, 2)}
        </pre>
      </section>

      <p data-testid="status-text" className="status-text">状态：{message}</p>
    </main>
  );
}
