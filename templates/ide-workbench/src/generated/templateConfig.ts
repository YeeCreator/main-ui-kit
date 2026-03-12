/**
 * 主区域模式类型。
 */
export type MainAreaMode = 'single' | 'split' | 'tabs' | 'split-tabs' | 'dock';

/**
 * 标签内容类型。
 */
export type TabContentType = 'text-editor' | 'viewport-2d' | 'viewport-3d' | 'custom' | 'flow-canvas';

/**
 * 交付模型类型。
 */
export interface TemplateDeliveryModel {
  shell: 'managed';
  content: 'detached';
}

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
 * 视口引擎选项。
 */
export interface TemplateViewportOptions {
  engine2d: string;
  engine3d: string;
}

/**
 * Docking 配置。
 */
export interface TemplateDockingOptions {
  persistLayout: boolean;
  layoutStorageKey: string;
}

/**
 * 模板配置类型。
 */
export interface TemplateConfig {
  appId: string;
  template: 'ide-workbench';
  deliveryModel: TemplateDeliveryModel;
  mainAreaMode: MainAreaMode;
  allowSplit: boolean;
  allowTabs: boolean;
  docking: TemplateDockingOptions;
  defaultTabContent: TabContentType;
  enabledTabContents: TabContentType[];
  elements: WorkbenchElementFlags;
  viewport: TemplateViewportOptions;
}

/**
 * 模板生成器输出的工作台配置。
 */
export const templateConfig: TemplateConfig = {
  appId: '__APP_ID__',
  template: 'ide-workbench',
  deliveryModel: {
    shell: 'managed',
    content: 'detached',
  },
  mainAreaMode: 'split-tabs',
  allowSplit: true,
  allowTabs: true,
  docking: {
    persistLayout: true,
    layoutStorageKey: 'main-ui-kit:dock-layout:v1:__APP_ID__',
  },
  defaultTabContent: 'flow-canvas',
  enabledTabContents: ['text-editor', 'viewport-2d', 'flow-canvas', 'custom'],
  elements: {
    menubar: true,
    toolbar: true,
    activitybar: true,
    leftSidebar: true,
    rightSidebar: true,
    bottomPanel: true,
    statusbar: true,
    settingsPage: true,
    keybindingsPage: true,
  },
  viewport: {
    engine2d: 'pixi',
    engine3d: 'none',
  },
};
