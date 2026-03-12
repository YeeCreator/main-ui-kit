// @main-ui-kit-managed-shell-version: 1.0.0

import { useRef, useState } from 'react';
import type { TabContentType, TemplateConfig } from '../../generated/templateConfig';
import { DetachedContentRouter } from '../../detached/content/DetachedContentRouter';
import { DockMainArea } from '../layout-engine/DockMainArea';
import { resolvePaneMode } from '../layout-engine/resolvePaneMode';
import { keybindingRows, settingsRows } from '../settings-keybindings/sampleData';

/**
 * 预览标签类型。
 */
type PreviewTabKind = TabContentType | 'settings-page' | 'keybindings-page';

/**
 * 工作台标签定义。
 */
interface PreviewTab {
  id: string;
  title: string;
  kind: PreviewTabKind;
}

/**
 * 工作台壳层参数。
 */
export interface WorkbenchShellProps {
  config: TemplateConfig;
}

/**
 * 渲染模板中的托管壳层。
 * @param props 工作台参数。
 * @returns React 组件。
 */
export function WorkbenchShell(props: WorkbenchShellProps) {
  const { config } = props;
  const idRef = useRef(0);
  const { tabsEnabled, splitEnabled, dockEnabled } = resolvePaneMode(config.mainAreaMode);
  const [leftTabs, setLeftTabs] = useState(() => createInitialTabs(config, false));
  const [rightTabs, setRightTabs] = useState(() => createInitialTabs(config, true));
  const [activeLeftTabId, setActiveLeftTabId] = useState(leftTabs[0]?.id ?? '');
  const [activeRightTabId, setActiveRightTabId] = useState(rightTabs[0]?.id ?? '');

  /**
   * 新建标签页。
   * @param pane 是否为右侧窗格。
   */
  function addTab(pane: boolean) {
    const nextKind = config.enabledTabContents[idRef.current % config.enabledTabContents.length] ?? config.defaultTabContent;
    idRef.current += 1;
    const nextTab = createTab(nextKind, `${pane ? 'right' : 'left'}-${idRef.current}`);

    if (pane) {
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
   * 打开特殊页面。
   * @param kind 页面类型。
   */
  function openPage(kind: 'settings-page' | 'keybindings-page') {
    const tab = createTab(kind, kind);
    const nextTabs = [tab, ...leftTabs.filter((item) => item.kind !== kind)];
    setLeftTabs(nextTabs);
    setActiveLeftTabId(tab.id);
  }

  return (
    <div className="template-shell">
      {config.elements.menubar ? (
        <header className="template-shell__menubar">
          <div>{config.appId}</div>
          <nav>
            <span>文件</span>
            <span>编辑</span>
            <span>视图</span>
            <span>窗口</span>
          </nav>
        </header>
      ) : null}

      {config.elements.toolbar ? (
        <div className="template-shell__toolbar">
          {!dockEnabled ? <button type="button" onClick={() => addTab(false)}>新建标签</button> : null}
          {!dockEnabled && splitEnabled ? <button type="button" onClick={() => addTab(true)}>右侧新建标签</button> : null}
          {config.elements.settingsPage ? <button type="button" onClick={() => openPage('settings-page')}>设置页</button> : null}
          {config.elements.keybindingsPage ? <button type="button" onClick={() => openPage('keybindings-page')}>快捷键页</button> : null}
        </div>
      ) : null}

      <div className="template-shell__body">
        {config.elements.activitybar ? (
          <aside className="template-shell__activitybar">
            <span>EX</span>
            <span>SR</span>
            <span>KB</span>
          </aside>
        ) : null}

        {config.elements.leftSidebar ? (
          <aside className="template-shell__sidebar">
            <h2>布局元素</h2>
            <ul>
              {Object.entries(config.elements).map(([key, value]) => (
                <li key={key}>{key}: {value ? 'on' : 'off'}</li>
              ))}
            </ul>
          </aside>
        ) : null}

        <main className={splitEnabled ? 'template-shell__main template-shell__main--split' : 'template-shell__main'}>
          {dockEnabled
            ? (
                <DockMainArea
                  config={config}
                  renderContent={(kind) => renderTabContent(kind as PreviewTabKind)}
                />
              )
            : (
                <>
                  {renderPane({
                    tabsEnabled,
                    tabs: leftTabs,
                    activeTabId: activeLeftTabId,
                    onActivate: setActiveLeftTabId,
                    defaultKind: config.defaultTabContent,
                  })}
                  {splitEnabled
                    ? renderPane({
                        tabsEnabled,
                        tabs: rightTabs,
                        activeTabId: activeRightTabId,
                        onActivate: setActiveRightTabId,
                        defaultKind: config.enabledTabContents[1] ?? config.defaultTabContent,
                      })
                    : null}
                </>
              )}
        </main>

        {config.elements.rightSidebar ? (
          <aside className="template-shell__sidebar template-shell__sidebar--right">
            <h2>模板能力</h2>
            <ul>
              <li>主区域模式：{config.mainAreaMode}</li>
              <li>默认标签：{config.defaultTabContent}</li>
              <li>Dock 持久化：{config.docking.persistLayout ? 'on' : 'off'}</li>
              <li>Dock 存储键：{config.docking.layoutStorageKey}</li>
              <li>2D 引擎：{config.viewport.engine2d}</li>
              <li>3D 引擎：{config.viewport.engine3d}</li>
              <li>壳层交付：{config.deliveryModel.shell}</li>
              <li>内容交付：{config.deliveryModel.content}</li>
            </ul>
          </aside>
        ) : null}
      </div>

      {config.elements.bottomPanel ? (
        <section className="template-shell__bottom-panel">
          <div>Problems</div>
          <div>0 错误</div>
          <div>模板处于占位渲染模式</div>
        </section>
      ) : null}

      {config.elements.statusbar ? (
        <footer className="template-shell__statusbar">
          <span>{config.appId}</span>
          <span>{config.mainAreaMode}</span>
          <span>ready</span>
        </footer>
      ) : null}
    </div>
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
  defaultKind: PreviewTabKind;
}) {
  const activeTab = options.tabs.find((item) => item.id === options.activeTabId) ?? options.tabs[0];
  const displayKind = options.tabsEnabled ? activeTab?.kind ?? options.defaultKind : options.defaultKind;

  return (
    <section className="template-shell__pane">
      {options.tabsEnabled ? (
        <div className="template-shell__tabs">
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
      <div className="template-shell__pane-content">{renderTabContent(displayKind)}</div>
    </section>
  );
}

/**
 * 渲染标签内容。
 * @param kind 标签类型。
 * @returns React 节点。
 */
function renderTabContent(kind: PreviewTabKind) {
  if (kind === 'settings-page') {
    return (
      <div>
        <h3>设置页模板</h3>
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
      </div>
    );
  }

  if (kind === 'keybindings-page') {
    return (
      <div>
        <h3>快捷键页模板</h3>
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
      </div>
    );
  }

  if (kind === 'viewport-2d') {
    return <div className="template-shell__viewport template-shell__viewport--2d">2D 视口占位</div>;
  }

  if (kind === 'viewport-3d') {
    return <div className="template-shell__viewport template-shell__viewport--3d">3D 视口占位</div>;
  }

  if (kind === 'custom' || kind === 'flow-canvas') {
    return <DetachedContentRouter contentType={kind} />;
  }

  return (
    <div className="template-shell__editor">
      <p>function mountWorkbench() {'{'}</p>
      <p>&nbsp;&nbsp;return 'text-editor';</p>
      <p>{'}'}</p>
    </div>
  );
}

/**
 * 创建初始标签列表。
 * @param config 模板配置。
 * @param rightPane 是否为右侧窗格。
 * @returns 标签列表。
 */
function createInitialTabs(config: TemplateConfig, rightPane: boolean) {
  const defaultKind = rightPane ? config.enabledTabContents[1] ?? config.defaultTabContent : config.defaultTabContent;
  return [createTab(defaultKind, rightPane ? 'right-default' : 'left-default')];
}

/**
 * 根据类型创建标签对象。
 * @param kind 标签类型。
 * @param suffix 后缀标识。
 * @returns 标签对象。
 */
function createTab(kind: PreviewTabKind, suffix: string): PreviewTab {
  return {
    id: `${kind}-${suffix}`,
    kind,
    title: tabTitleMap[kind],
  };
}

/**
 * 标签标题映射。
 */
const tabTitleMap: Record<PreviewTabKind, string> = {
  'text-editor': '文本编辑器',
  'viewport-2d': '2D 视口',
  'viewport-3d': '3D 视口',
  custom: '自定义视图',
  'flow-canvas': '流程画布',
  'settings-page': '设置',
  'keybindings-page': '快捷键',
};
