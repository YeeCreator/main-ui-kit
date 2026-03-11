/**
 * 工作台元素键名集合。
 */
export const workbenchElementKeys = [
  'menubar',
  'toolbar',
  'activitybar',
  'leftSidebar',
  'rightSidebar',
  'bottomPanel',
  'statusbar',
  'settingsPage',
  'keybindingsPage',
] as const;

/**
 * 主区域模式集合。
 */
export const mainAreaModes = ['single', 'split', 'tabs', 'split-tabs'] as const;

/**
 * 标签内容类型集合。
 */
export const tabContentTypes = ['text-editor', 'viewport-2d', 'viewport-3d', 'custom'] as const;

/**
 * 工作台元素键名类型。
 */
export type WorkbenchElementKey = (typeof workbenchElementKeys)[number];

/**
 * 主区域模式类型。
 */
export type MainAreaMode = (typeof mainAreaModes)[number];

/**
 * 标签内容类型。
 */
export type TabContentType = (typeof tabContentTypes)[number];

/**
 * 工作台元素开关。
 */
export interface WorkbenchElementFlags {
  menubar: boolean;
  toolbar: boolean;
  activitybar: boolean;
  leftSidebar: boolean;
  rightSidebar: boolean;
  bottomPanel: boolean;
  statusbar: boolean;
  settingsPage: boolean;
  keybindingsPage: boolean;
}

/**
 * 视口配置。
 */
export interface TemplateViewportOptions {
  engine2d: 'none' | 'pixi' | 'konva' | 'custom';
  engine3d: 'none' | 'three' | 'custom';
}

/**
 * 主模板配置结构。
 */
export interface MainUiTemplateConfig {
  appId: string;
  template: 'ide-workbench';
  mainAreaMode: MainAreaMode;
  allowSplit: boolean;
  allowTabs: boolean;
  defaultTabContent: TabContentType;
  enabledTabContents: TabContentType[];
  elements: WorkbenchElementFlags;
  viewport: TemplateViewportOptions;
}

/**
 * 元素中文标签映射。
 */
export const workbenchElementLabels: Record<WorkbenchElementKey, string> = {
  menubar: '菜单栏',
  toolbar: '工具条',
  activitybar: '活动栏',
  leftSidebar: '左侧栏',
  rightSidebar: '右侧栏',
  bottomPanel: '底部面板',
  statusbar: '状态栏',
  settingsPage: '设置页',
  keybindingsPage: '快捷键页',
};

/**
 * 标签内容中文标签映射。
 */
export const tabContentLabels: Record<TabContentType, string> = {
  'text-editor': '文本编辑视图',
  'viewport-2d': '2D 视口视图',
  'viewport-3d': '3D 视口视图',
  custom: '自定义视图',
};

/**
 * 深拷贝模板配置，避免预设对象被直接修改。
 * @param config 原始配置。
 * @returns 克隆后的配置。
 */
export function cloneTemplateConfig(config: MainUiTemplateConfig): MainUiTemplateConfig {
  return {
    ...config,
    enabledTabContents: [...config.enabledTabContents],
    elements: { ...config.elements },
    viewport: { ...config.viewport },
  };
}
