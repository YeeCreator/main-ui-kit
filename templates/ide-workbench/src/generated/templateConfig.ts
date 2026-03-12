/**
 * 主区域模式类型。
 */
export type MainAreaMode = 'single' | 'split' | 'tabs' | 'split-tabs';

/**
 * 标签内容类型。
 */
export type TabContentType = 'text-editor' | 'viewport-2d' | 'viewport-3d' | 'custom';

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
 * 模板配置类型。
 */
export interface TemplateConfig {
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
 * 模板生成器输出的工作台配置。
 */
export const templateConfig: TemplateConfig = {
  appId: '__APP_ID__',
  template: 'ide-workbench',
  mainAreaMode: 'split-tabs',
  allowSplit: true,
  allowTabs: true,
  defaultTabContent: 'text-editor',
  enabledTabContents: ['text-editor', 'viewport-2d', 'custom'],
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
