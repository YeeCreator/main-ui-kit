import { useEffect, useRef, useState } from 'react';
import { keybindingRows, settingsRows, sidebarModules } from './sampleData';
import { tabContentLabels, workbenchElementLabels, type MainUiTemplateConfig, type TabContentType } from './models';

/**
 * 预览内部标签类型。
 */
type PreviewTabKind = TabContentType | 'settings-page' | 'keybindings-page';

/**
 * 预览标签结构。
 */
interface PreviewTab {
  id: string;
  kind: PreviewTabKind;
  title: string;
}

/**
 * 工作台预览参数。
 */
export interface WorkbenchPreviewProps {
  config: MainUiTemplateConfig;
}

/**
 * 工作台模板预览组件。
 * @param props 预览参数。
 * @returns React 组件。
 */
export function WorkbenchPreview(props: WorkbenchPreviewProps) {
  const { config } = props;
  const splitEnabled = config.mainAreaMode === 'split' || config.mainAreaMode === 'split-tabs';
  const tabsEnabled = config.mainAreaMode === 'tabs' || config.mainAreaMode === 'split-tabs';
  const idRef = useRef(0);
  const [leftTabs, setLeftTabs] = useState(() => createInitialTabs(config, false));
  const [rightTabs, setRightTabs] = useState(() => createInitialTabs(config, true));
  const [activeLeftTabId, setActiveLeftTabId] = useState(leftTabs[0]?.id ?? '');
  const [activeRightTabId, setActiveRightTabId] = useState(rightTabs[0]?.id ?? '');

  useEffect(() => {
    const nextLeftTabs = sanitizeTabs(leftTabs, config, false);
    const nextRightTabs = sanitizeTabs(rightTabs, config, true);
    setLeftTabs(nextLeftTabs);
    setRightTabs(nextRightTabs);
    setActiveLeftTabId(selectActiveTabId(activeLeftTabId, nextLeftTabs));
    setActiveRightTabId(selectActiveTabId(activeRightTabId, nextRightTabs));
  }, [config]);

  /**
   * 在指定窗格追加一个业务标签。
   * @param rightPane 是否追加到右侧窗格。
   */
  function addContentTab(rightPane: boolean) {
    const enabledKinds = config.enabledTabContents.length > 0 ? config.enabledTabContents : [config.defaultTabContent];
    const nextKind = enabledKinds[idRef.current % enabledKinds.length] ?? config.defaultTabContent;
    idRef.current += 1;
    const nextTab = createPreviewTab(nextKind, `${rightPane ? 'right' : 'left'}-${idRef.current}`);

    if (rightPane) {
      const nextTabs = [...rightTabs, nextTab];
      setRightTabs(nextTabs);
      setActiveRightTabId(nextTab.id);
      return;
    }

    const nextTabs = [...leftTabs, nextTab];
    setLeftTabs(nextTabs);
    setActiveLeftTabId(nextTab.id);
  }

  /**
   * 打开设置页或快捷键页。
   * @param kind 页面类型。
   */
  function openWorkbenchPage(kind: 'settings-page' | 'keybindings-page') {
    const nextTab = createPreviewTab(kind, kind);
    const nextTabs = [nextTab, ...leftTabs.filter((item: PreviewTab) => item.kind !== kind)];
    setLeftTabs(nextTabs);
    setActiveLeftTabId(nextTab.id);
  }

  return (
    <section className="preview-shell">
      {config.elements.menubar ? (
        <header className="preview-shell__menubar">
          <div className="preview-shell__brand">
            <strong>{config.appId}</strong>
            <span>IDE Workbench Template</span>
          </div>
          <nav className="preview-shell__menu-items" aria-label="顶部菜单">
            <span>文件</span>
            <span>编辑</span>
            <span>选择</span>
            <span>视图</span>
            <span>运行</span>
            <span>帮助</span>
          </nav>
        </header>
      ) : null}

      {config.elements.toolbar ? (
        <div className="preview-shell__toolbar">
          <button type="button" onClick={() => addContentTab(false)}>新建标签</button>
          {splitEnabled ? <button type="button" onClick={() => addContentTab(true)}>右侧新建标签</button> : null}
          {config.elements.settingsPage ? (
            <button type="button" onClick={() => openWorkbenchPage('settings-page')}>打开设置页</button>
          ) : null}
          {config.elements.keybindingsPage ? (
            <button type="button" onClick={() => openWorkbenchPage('keybindings-page')}>打开快捷键页</button>
          ) : null}
        </div>
      ) : null}

      <div className="preview-shell__body">
        {config.elements.activitybar ? (
          <aside className="preview-shell__activitybar" aria-label="活动栏">
            <button type="button">EX</button>
            <button type="button">SR</button>
            <button type="button">KB</button>
            <button type="button">AI</button>
          </aside>
        ) : null}

        {config.elements.leftSidebar ? (
          <aside className="preview-shell__sidebar" aria-label="左侧栏">
            <h2>布局模块</h2>
            <div className="preview-shell__sidebar-cards">
              {sidebarModules.map((module) => (
                <article key={module.title} className="preview-shell__info-card">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </article>
              ))}
            </div>
          </aside>
        ) : null}

        <main className={splitEnabled ? 'preview-shell__main preview-shell__main--split' : 'preview-shell__main'}>
          {renderPane({
            tabsEnabled,
            tabs: leftTabs,
            activeTabId: activeLeftTabId,
            onActivate: setActiveLeftTabId,
            fallbackKind: config.defaultTabContent,
          })}
          {splitEnabled
            ? renderPane({
                tabsEnabled,
                tabs: rightTabs,
                activeTabId: activeRightTabId,
                onActivate: setActiveRightTabId,
                fallbackKind: config.enabledTabContents[1] ?? config.defaultTabContent,
              })
            : null}
        </main>

        {config.elements.rightSidebar ? (
          <aside className="preview-shell__sidebar preview-shell__sidebar--right" aria-label="右侧栏">
            <h2>模板参数</h2>
            <dl className="preview-shell__meta-list">
              <div>
                <dt>主区域模式</dt>
                <dd>{config.mainAreaMode}</dd>
              </div>
              <div>
                <dt>默认标签</dt>
                <dd>{tabContentLabels[config.defaultTabContent]}</dd>
              </div>
              <div>
                <dt>2D 引擎</dt>
                <dd>{config.viewport.engine2d}</dd>
              </div>
              <div>
                <dt>3D 引擎</dt>
                <dd>{config.viewport.engine3d}</dd>
              </div>
            </dl>
          </aside>
        ) : null}
      </div>

      {config.elements.bottomPanel ? (
        <section className="preview-shell__bottom-panel">
          <span>Problems 0</span>
          <span>Output template-renderer</span>
          <span>Terminal ready</span>
        </section>
      ) : null}

      {config.elements.statusbar ? (
        <footer className="preview-shell__statusbar">
          <span>{config.appId}</span>
          <span>{config.mainAreaMode}</span>
          <span>{config.allowSplit ? 'split on' : 'split off'}</span>
          <span>{config.allowTabs ? 'tabs on' : 'tabs off'}</span>
        </footer>
      ) : null}

      <section className="preview-shell__elements-grid" aria-label="元素状态">
        {Object.entries(workbenchElementLabels).map(([key, label]) => (
          <div key={key} className="preview-shell__element-pill">
            <span>{label}</span>
            <strong>{config.elements[key as keyof typeof config.elements] ? 'ON' : 'OFF'}</strong>
          </div>
        ))}
      </section>
    </section>
  );
}

/**
 * 渲染单个主区域窗格。
 * @param options 渲染参数。
 * @returns React 节点。
 */
function renderPane(options: {
  tabsEnabled: boolean;
  tabs: PreviewTab[];
  activeTabId: string;
  onActivate: (tabId: string) => void;
  fallbackKind: PreviewTabKind;
}) {
  const activeTab = options.tabs.find((item) => item.id === options.activeTabId) ?? options.tabs[0];
  const displayKind = options.tabsEnabled ? activeTab?.kind ?? options.fallbackKind : options.fallbackKind;

  return (
    <section className="preview-shell__pane">
      {options.tabsEnabled ? (
        <div className="preview-shell__tabs">
          {options.tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activeTab?.id ? 'is-active' : ''}
              onClick={() => options.onActivate(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
      ) : null}
      <div className="preview-shell__pane-content">{renderTabContent(displayKind)}</div>
    </section>
  );
}

/**
 * 创建初始标签集合。
 * @param config 模板配置。
 * @param rightPane 是否为右侧窗格。
 * @returns 初始标签列表。
 */
function createInitialTabs(config: MainUiTemplateConfig, rightPane: boolean): PreviewTab[] {
  const nextKind = rightPane ? config.enabledTabContents[1] ?? config.defaultTabContent : config.defaultTabContent;
  return [createPreviewTab(nextKind, rightPane ? 'right-default' : 'left-default')];
}

/**
 * 根据当前配置过滤无效标签。
 * @param tabs 原始标签列表。
 * @param config 模板配置。
 * @param rightPane 是否为右侧窗格。
 * @returns 清理后的标签列表。
 */
function sanitizeTabs(tabs: PreviewTab[], config: MainUiTemplateConfig, rightPane: boolean): PreviewTab[] {
  const allowedKinds = new Set<PreviewTabKind>(config.enabledTabContents);

  if (config.elements.settingsPage) {
    allowedKinds.add('settings-page');
  }
  if (config.elements.keybindingsPage) {
    allowedKinds.add('keybindings-page');
  }

  const nextTabs = tabs.filter((item) => allowedKinds.has(item.kind));
  return nextTabs.length > 0 ? nextTabs : createInitialTabs(config, rightPane);
}

/**
 * 选择当前激活标签。
 * @param activeTabId 当前激活标签 ID。
 * @param tabs 标签列表。
 * @returns 合法的激活标签 ID。
 */
function selectActiveTabId(activeTabId: string, tabs: PreviewTab[]) {
  return tabs.some((item) => item.id === activeTabId) ? activeTabId : (tabs[0]?.id ?? '');
}

/**
 * 创建预览标签。
 * @param kind 标签类型。
 * @param suffix 唯一后缀。
 * @returns 标签对象。
 */
function createPreviewTab(kind: PreviewTabKind, suffix: string): PreviewTab {
  return {
    id: `${kind}-${suffix}`,
    kind,
    title: previewTabLabels[kind],
  };
}

/**
 * 渲染标签内容。
 * @param kind 标签类型。
 * @returns React 节点。
 */
function renderTabContent(kind: PreviewTabKind) {
  if (kind === 'settings-page') {
    return (
      <section className="preview-pane preview-pane--table">
        <header className="preview-pane__header">
          <h3>设置页模板</h3>
          <p>以结构化表格展示布局、标签和视口的配置入口。</p>
        </header>
        <table>
          <thead>
            <tr>
              <th>分组</th>
              <th>键</th>
              <th>值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {settingsRows.map((row) => (
              <tr key={row.key}>
                <td>{row.section}</td>
                <td>{row.key}</td>
                <td>{row.value}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  if (kind === 'keybindings-page') {
    return (
      <section className="preview-pane preview-pane--table">
        <header className="preview-pane__header">
          <h3>快捷键页模板</h3>
          <p>预留命令注册表、冲突检测与按键映射展示层。</p>
        </header>
        <table>
          <thead>
            <tr>
              <th>命令</th>
              <th>按键</th>
              <th>范围</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {keybindingRows.map((row) => (
              <tr key={row.command}>
                <td>{row.command}</td>
                <td>{row.keybinding}</td>
                <td>{row.scope}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  if (kind === 'viewport-2d') {
    return (
      <section className="preview-pane preview-pane--viewport2d">
        <header className="preview-pane__header">
          <h3>2D 视口模板</h3>
          <p>适合作为白板、地图、流程图或关卡编辑器视图入口。</p>
        </header>
        <div className="preview-pane__viewport-grid">
          <span>Grid</span>
          <span>Snap</span>
          <span>Layers</span>
        </div>
      </section>
    );
  }

  if (kind === 'viewport-3d') {
    return (
      <section className="preview-pane preview-pane--viewport3d">
        <header className="preview-pane__header">
          <h3>3D 视口模板</h3>
          <p>适合作为游戏场景、关卡演示或三维编辑器宿主视图。</p>
        </header>
        <div className="preview-pane__viewport-cards">
          <article>Scene Graph</article>
          <article>Camera</article>
          <article>Lighting</article>
        </div>
      </section>
    );
  }

  if (kind === 'custom') {
    return (
      <section className="preview-pane preview-pane--custom">
        <header className="preview-pane__header">
          <h3>自定义视图插槽</h3>
          <p>该区域可替换为属性检查器、AI 面板、数据看板或业务私有视图。</p>
        </header>
        <ul>
          <li>支持通过注册表注入组件。</li>
          <li>支持与命令层、配置层双向联动。</li>
          <li>支持延迟挂载重型视图。</li>
        </ul>
      </section>
    );
  }

  return (
    <section className="preview-pane preview-pane--editor">
      <header className="preview-pane__header">
        <h3>文本编辑视图模板</h3>
        <p>可替换为 Monaco、CodeMirror 或业务私有编辑器。</p>
      </header>
      <div className="preview-pane__editor-lines">
        <span>1  const workbench = createWorkbench(config)</span>
        <span>2  workbench.registerView('viewport-2d', mountViewport2d)</span>
        <span>3  workbench.registerCommand('open.settings', openSettingsPage)</span>
        <span>4  export default workbench</span>
      </div>
    </section>
  );
}

/**
 * 预览标签中文名。
 */
const previewTabLabels: Record<PreviewTabKind, string> = {
  'text-editor': '文本编辑器',
  'viewport-2d': '2D 视口',
  'viewport-3d': '3D 视口',
  custom: '自定义视图',
  'settings-page': '设置',
  'keybindings-page': '快捷键',
};
