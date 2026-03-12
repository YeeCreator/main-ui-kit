// @main-ui-kit-managed-shell-version: 1.1.0

import { useEffect, useMemo, useRef, useState } from 'react';
import type { TabContentType, TemplateConfig } from '../../generated/templateConfig';

/**
 * Dock 标签类型。
 */
export type DockTabKind = TabContentType | 'settings-page' | 'keybindings-page';

/**
 * Dock 标签结构。
 */
interface DockTab {
  id: string;
  title: string;
  kind: DockTabKind;
}

/**
 * Dock 窗格结构。
 */
interface DockPane {
  id: string;
  tabs: DockTab[];
  activeTabId: string;
}

/**
 * Dock 布局方向。
 */
type DockDirection = 'row' | 'column';

/**
 * Dock 布局状态。
 */
interface DockLayoutState {
  direction: DockDirection;
  panes: DockPane[];
  activePaneId: string;
}

/**
 * Dock 主区域参数。
 */
export interface DockMainAreaProps {
  config: TemplateConfig;
  renderContent: (kind: DockTabKind) => React.ReactNode;
}

/**
 * 托管层 Dock 主区域。
 * @param props 组件参数。
 * @returns React 组件。
 */
export function DockMainArea(props: DockMainAreaProps) {
  const { config, renderContent } = props;
  const sequenceRef = useRef(0);
  const [layout, setLayout] = useState<DockLayoutState>(() => createInitialLayout(config));

  const layoutStorageKey = useMemo(() => {
    const configuredKey = config.docking?.layoutStorageKey?.trim();
    return configuredKey && configuredKey.length > 0
      ? configuredKey
      : `main-ui-kit:dock-layout:v1:${config.appId}`;
  }, [config.appId, config.docking?.layoutStorageKey]);

  useEffect(() => {
    const nextLayout = loadLayoutFromStorage(layoutStorageKey, config);
    if (nextLayout) {
      setLayout(nextLayout);
      return;
    }

    setLayout(createInitialLayout(config));
  }, [config, layoutStorageKey]);

  useEffect(() => {
    if (!config.docking?.persistLayout) {
      return;
    }

    const payload = {
      appId: config.appId,
      version: 1,
      direction: layout.direction,
      activePaneId: layout.activePaneId,
      panes: layout.panes,
    };
    window.localStorage.setItem(layoutStorageKey, JSON.stringify(payload));
  }, [config.appId, config.docking?.persistLayout, layout, layoutStorageKey]);

  /**
   * 新建内容标签。
   */
  function createContentTab(): DockTab {
    const enabledKinds = config.enabledTabContents.length > 0 ? config.enabledTabContents : [config.defaultTabContent];
    const nextKind = enabledKinds[sequenceRef.current % enabledKinds.length] ?? config.defaultTabContent;
    sequenceRef.current += 1;

    return {
      id: `${nextKind}-${sequenceRef.current}`,
      kind: nextKind,
      title: tabTitleMap[nextKind],
    };
  }

  /**
   * 激活窗格。
   * @param paneId 窗格 ID。
   */
  function activatePane(paneId: string) {
    setLayout((current) => ({ ...current, activePaneId: paneId }));
  }

  /**
   * 在激活窗格中新增标签。
   */
  function addTabToActivePane() {
    setLayout((current) => {
      const nextTab = createContentTab();
      const nextPanes = current.panes.map((pane) => {
        if (pane.id !== current.activePaneId) {
          return pane;
        }

        return {
          ...pane,
          tabs: [...pane.tabs, nextTab],
          activeTabId: nextTab.id,
        };
      });

      return {
        ...current,
        panes: nextPanes,
      };
    });
  }

  /**
   * 拆分当前窗格。
   * @param direction 拆分方向。
   */
  function splitActivePane(direction: DockDirection) {
    setLayout((current) => {
      const activeIndex = current.panes.findIndex((pane) => pane.id === current.activePaneId);
      const nextTab = createContentTab();
      const nextPane: DockPane = {
        id: `pane-${Date.now()}-${Math.floor(Math.random() * 10_000)}`,
        tabs: [nextTab],
        activeTabId: nextTab.id,
      };

      const nextPanes = [...current.panes];
      const insertIndex = activeIndex >= 0 ? activeIndex + 1 : nextPanes.length;
      nextPanes.splice(insertIndex, 0, nextPane);

      return {
        ...current,
        direction,
        panes: nextPanes,
        activePaneId: nextPane.id,
      };
    });
  }

  /**
   * 切换布局方向。
   */
  function toggleDirection() {
    setLayout((current) => ({
      ...current,
      direction: current.direction === 'row' ? 'column' : 'row',
    }));
  }

  /**
   * 移动激活窗格。
   * @param step 方向步长。
   */
  function moveActivePane(step: -1 | 1) {
    setLayout((current) => {
      const currentIndex = current.panes.findIndex((pane) => pane.id === current.activePaneId);
      const nextIndex = currentIndex + step;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= current.panes.length) {
        return current;
      }

      const nextPanes = [...current.panes];
      const [pane] = nextPanes.splice(currentIndex, 1);
      if (!pane) {
        return current;
      }
      nextPanes.splice(nextIndex, 0, pane);

      return {
        ...current,
        panes: nextPanes,
      };
    });
  }

  /**
   * 关闭激活窗格。
   */
  function closeActivePane() {
    setLayout((current) => {
      if (current.panes.length <= 1) {
        return current;
      }

      const currentIndex = current.panes.findIndex((pane) => pane.id === current.activePaneId);
      if (currentIndex < 0) {
        return current;
      }

      const nextPanes = current.panes.filter((pane) => pane.id !== current.activePaneId);
      const fallbackPane = nextPanes[Math.max(0, currentIndex - 1)] ?? nextPanes[0];
      if (!fallbackPane) {
        return current;
      }

      return {
        ...current,
        panes: nextPanes,
        activePaneId: fallbackPane.id,
      };
    });
  }

  /**
   * 打开设置或快捷键页。
   * @param kind 页面类型。
   */
  function openSystemPage(kind: 'settings-page' | 'keybindings-page') {
    setLayout((current) => {
      const targetPane = current.panes.find((pane) => pane.id === current.activePaneId) ?? current.panes[0];
      if (!targetPane) {
        return current;
      }

      const existingTab = targetPane.tabs.find((tab) => tab.kind === kind);
      if (existingTab) {
        return {
          ...current,
          panes: current.panes.map((pane) => (pane.id === targetPane.id ? { ...pane, activeTabId: existingTab.id } : pane)),
        };
      }

      sequenceRef.current += 1;
      const nextTab: DockTab = {
        id: `${kind}-${sequenceRef.current}`,
        kind,
        title: tabTitleMap[kind],
      };

      return {
        ...current,
        panes: current.panes.map((pane) => {
          if (pane.id !== targetPane.id) {
            return pane;
          }
          return {
            ...pane,
            tabs: [nextTab, ...pane.tabs],
            activeTabId: nextTab.id,
          };
        }),
      };
    });
  }

  /**
   * 激活指定标签。
   * @param paneId 窗格 ID。
   * @param tabId 标签 ID。
   */
  function activateTab(paneId: string, tabId: string) {
    setLayout((current) => ({
      ...current,
      activePaneId: paneId,
      panes: current.panes.map((pane) => (pane.id === paneId ? { ...pane, activeTabId: tabId } : pane)),
    }));
  }

  /**
   * 关闭指定标签。
   * @param paneId 窗格 ID。
   * @param tabId 标签 ID。
   */
  function closeTab(paneId: string, tabId: string) {
    setLayout((current) => {
      const nextPanes = current.panes
        .map((pane) => {
          if (pane.id !== paneId) {
            return pane;
          }

          const filteredTabs = pane.tabs.filter((tab) => tab.id !== tabId);
          if (filteredTabs.length === 0) {
            return null;
          }

          const nextActive = filteredTabs.some((tab) => tab.id === pane.activeTabId)
            ? pane.activeTabId
            : filteredTabs[0]?.id ?? '';

          return {
            ...pane,
            tabs: filteredTabs,
            activeTabId: nextActive,
          };
        })
        .filter((pane): pane is DockPane => pane != null);

      if (nextPanes.length === 0) {
        return createInitialLayout(config);
      }

      const nextActivePane = nextPanes.some((pane) => pane.id === current.activePaneId)
        ? current.activePaneId
        : nextPanes[0]?.id ?? '';

      return {
        ...current,
        panes: nextPanes,
        activePaneId: nextActivePane,
      };
    });
  }

  return (
    <section className="dock-main" aria-label="Dock 主区域">
      <header className="dock-main__commands">
        <button type="button" onClick={addTabToActivePane}>新建标签</button>
        <button type="button" onClick={() => splitActivePane('row')}>横向拆分</button>
        <button type="button" onClick={() => splitActivePane('column')}>纵向拆分</button>
        <button type="button" onClick={toggleDirection}>切换方向</button>
        <button type="button" onClick={() => moveActivePane(-1)}>左移窗格</button>
        <button type="button" onClick={() => moveActivePane(1)}>右移窗格</button>
        <button type="button" onClick={closeActivePane}>关闭窗格</button>
        {config.elements.settingsPage ? (
          <button type="button" onClick={() => openSystemPage('settings-page')}>设置页</button>
        ) : null}
        {config.elements.keybindingsPage ? (
          <button type="button" onClick={() => openSystemPage('keybindings-page')}>快捷键页</button>
        ) : null}
      </header>

      <div className={layout.direction === 'row' ? 'dock-main__panes dock-main__panes--row' : 'dock-main__panes dock-main__panes--column'}>
        {layout.panes.map((pane) => {
          const activeTab = pane.tabs.find((tab) => tab.id === pane.activeTabId) ?? pane.tabs[0];
          const isActivePane = pane.id === layout.activePaneId;

          return (
            <article
              key={pane.id}
              className={isActivePane ? 'dock-pane is-active' : 'dock-pane'}
              onMouseDown={() => activatePane(pane.id)}
            >
              <div className="dock-pane__tabs">
                {pane.tabs.map((tab) => (
                  <div key={tab.id} className={tab.id === activeTab?.id ? 'dock-tab is-active' : 'dock-tab'}>
                    <button type="button" onClick={() => activateTab(pane.id, tab.id)}>{tab.title}</button>
                    <button type="button" className="dock-tab__close" aria-label="关闭标签" onClick={() => closeTab(pane.id, tab.id)}>×</button>
                  </div>
                ))}
              </div>
              <div className="dock-pane__content">{activeTab ? renderContent(activeTab.kind) : null}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/**
 * 创建初始布局。
 * @param config 模板配置。
 * @returns 初始布局。
 */
function createInitialLayout(config: TemplateConfig): DockLayoutState {
  const firstTab: DockTab = {
    id: `${config.defaultTabContent}-default`,
    kind: config.defaultTabContent,
    title: tabTitleMap[config.defaultTabContent],
  };

  const firstPane: DockPane = {
    id: 'pane-default',
    tabs: [firstTab],
    activeTabId: firstTab.id,
  };

  return {
    direction: 'row',
    panes: [firstPane],
    activePaneId: firstPane.id,
  };
}

/**
 * 从本地存储读取布局。
 * @param storageKey 存储键。
 * @param config 模板配置。
 * @returns 布局状态。
 */
function loadLayoutFromStorage(storageKey: string, config: TemplateConfig): DockLayoutState | null {
  if (!config.docking?.persistLayout) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<DockLayoutState>;
    if (!parsed || !Array.isArray(parsed.panes) || parsed.panes.length === 0) {
      return null;
    }

    const allowedKinds = new Set<DockTabKind>(config.enabledTabContents);
    if (config.elements.settingsPage) {
      allowedKinds.add('settings-page');
    }
    if (config.elements.keybindingsPage) {
      allowedKinds.add('keybindings-page');
    }

    const panes = parsed.panes
      .map((pane) => {
        const validTabs = (pane.tabs ?? []).filter((tab): tab is DockTab => allowedKinds.has(tab.kind));
        if (validTabs.length === 0) {
          return null;
        }

        const activeTabId = validTabs.some((tab) => tab.id === pane.activeTabId)
          ? (pane.activeTabId ?? validTabs[0]?.id ?? '')
          : (validTabs[0]?.id ?? '');

        return {
          id: pane.id ?? `pane-${Math.random().toString(36).slice(2, 8)}`,
          tabs: validTabs,
          activeTabId,
        };
      })
      .filter((pane): pane is DockPane => pane != null);

    if (panes.length === 0) {
      return null;
    }

    const activePaneId = panes.some((pane) => pane.id === parsed.activePaneId)
      ? (parsed.activePaneId ?? panes[0]?.id ?? '')
      : (panes[0]?.id ?? '');

    return {
      direction: parsed.direction === 'column' ? 'column' : 'row',
      panes,
      activePaneId,
    };
  } catch {
    return null;
  }
}

/**
 * 标签标题映射。
 */
const tabTitleMap: Record<DockTabKind, string> = {
  'text-editor': '文本编辑器',
  'viewport-2d': '2D 视口',
  'viewport-3d': '3D 视口',
  custom: '自定义视图',
  'flow-canvas': '流程画布',
  'settings-page': '设置',
  'keybindings-page': '快捷键',
};
