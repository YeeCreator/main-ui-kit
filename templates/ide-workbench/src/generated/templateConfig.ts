/**
 * 模板生成器输出的工作台配置。
 */
export const templateConfig = {
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
} as const;

/**
 * 模板配置类型。
 */
export type TemplateConfig = typeof templateConfig;
