// @main-ui-kit-managed-shell-version: 1.0.0

import type { MainAreaMode } from '../../generated/templateConfig';

/**
 * 主区域布局解析结果。
 */
export interface PaneModeResult {
  splitEnabled: boolean;
  tabsEnabled: boolean;
}

/**
 * 根据主区域模式解析窗格能力。
 * @param mainAreaMode 主区域模式。
 * @returns 布局解析结果。
 */
export function resolvePaneMode(mainAreaMode: MainAreaMode): PaneModeResult {
  return {
    splitEnabled: mainAreaMode === 'split' || mainAreaMode === 'split-tabs',
    tabsEnabled: mainAreaMode === 'tabs' || mainAreaMode === 'split-tabs',
  };
}
