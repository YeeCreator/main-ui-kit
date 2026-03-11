import { cloneTemplateConfig, type MainUiTemplateConfig } from './models';

/**
 * 预设标识类型。
 */
export type PresetId = 'preset-math-whiteboard' | 'preset-game-workbench';

/**
 * 预设元信息。
 */
export interface PresetOption {
  id: PresetId;
  name: string;
  description: string;
}

/**
 * 数学白板预设。
 */
const mathWhiteboardPreset: MainUiTemplateConfig = {
  appId: 'preset-math-whiteboard',
  template: 'ide-workbench',
  mainAreaMode: 'split-tabs',
  allowSplit: true,
  allowTabs: true,
  defaultTabContent: 'viewport-2d',
  enabledTabContents: ['text-editor', 'viewport-2d', 'custom'],
  elements: {
    menubar: true,
    toolbar: true,
    activitybar: true,
    leftSidebar: true,
    rightSidebar: true,
    bottomPanel: false,
    statusbar: true,
    settingsPage: true,
    keybindingsPage: true,
  },
  viewport: {
    engine2d: 'pixi',
    engine3d: 'none',
  },
};

/**
 * 游戏工作台预设。
 */
const gameWorkbenchPreset: MainUiTemplateConfig = {
  appId: 'preset-game-workbench',
  template: 'ide-workbench',
  mainAreaMode: 'split-tabs',
  allowSplit: true,
  allowTabs: true,
  defaultTabContent: 'viewport-3d',
  enabledTabContents: ['text-editor', 'viewport-2d', 'viewport-3d', 'custom'],
  elements: {
    menubar: false,
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
    engine3d: 'three',
  },
};

/**
 * 预设配置字典。
 */
export const presetConfigMap: Record<PresetId, MainUiTemplateConfig> = {
  'preset-math-whiteboard': mathWhiteboardPreset,
  'preset-game-workbench': gameWorkbenchPreset,
};

/**
 * 预设选项列表。
 */
export const presetOptions: PresetOption[] = [
  {
    id: 'preset-math-whiteboard',
    name: '数学白板工作台',
    description: '以 2D 视口与文本编辑为核心，适合白板、公式编辑与图形推演类产品。',
  },
  {
    id: 'preset-game-workbench',
    name: '游戏工作台',
    description: '同时开放 2D / 3D / 文本多类标签，适合规则实验和轻量编辑器宿主。',
  },
];

/**
 * 读取指定预设的克隆配置。
 * @param presetId 预设标识。
 * @returns 可编辑的模板配置副本。
 */
export function createPresetConfig(presetId: PresetId): MainUiTemplateConfig {
  return cloneTemplateConfig(presetConfigMap[presetId]);
}
