import { createSceneKitCore } from '@main-ui-kit/core';
import { runExporter } from '@main-ui-kit/exporter';
import { createWebHostAdapter } from '@main-ui-kit/host-web';
import { createCanvasMode } from '@main-ui-kit/mode-canvas';
import { createMapMode } from '@main-ui-kit/mode-map';

/**
 * Web 宿主演示应用入口组件。
 * @returns 宿主页面内容。
 */
export function App() {
  const core = createSceneKitCore({ appId: 'web-host-demo' });
  const host = createWebHostAdapter(core);
  const canvasMode = createCanvasMode();
  const mapMode = createMapMode();
  const exportBundle = runExporter(core.getDocument());

  return (
    <main className="app-shell">
      <h1 className="title">Scene-Kit Web Host</h1>
      <section className="card">
        <p>当前阶段：M0 工程初始化已完成最小装配。</p>
        <p>可用模式：{`${canvasMode.id}, ${mapMode.id}`}</p>
        <p>本地存储能力：{host.capability.storage ? '已启用' : '未启用'}</p>
        <p>导出版本：{exportBundle.metadata.version}</p>
      </section>
    </main>
  );
}
