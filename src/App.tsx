import { useEffect, useState } from 'react';
import './App.css';
import { WorkbenchPreview } from './workbench/WorkbenchPreview';
import {
  cloneTemplateConfig,
  mainAreaModes,
  tabContentLabels,
  tabContentTypes,
  workbenchElementKeys,
  workbenchElementLabels,
  type MainAreaMode,
  type MainUiTemplateConfig,
  type TabContentType,
  type WorkbenchElementKey,
} from './workbench/models';
import { createPresetConfig, presetOptions, type PresetId } from './workbench/presets';

/**
 * 应用主入口，负责切换预设并驱动工作台预览。
 * @returns React 组件。
 */
function App() {
  const [presetId, setPresetId] = useState<PresetId>('preset-math-whiteboard');
  const [config, setConfig] = useState<MainUiTemplateConfig>(() => createPresetConfig('preset-math-whiteboard'));

  useEffect(() => {
    setConfig(createPresetConfig(presetId));
  }, [presetId]);

  /**
   * 切换元素开关。
   * @param key 元素键名。
   */
  function toggleElement(key: WorkbenchElementKey) {
    setConfig((currentConfig) => ({
      ...currentConfig,
      elements: {
        ...currentConfig.elements,
        [key]: !currentConfig.elements[key],
      },
    }));
  }

  /**
   * 切换主区域模式。
   * @param mode 新的主区域模式。
   */
  function setMainAreaMode(mode: MainAreaMode) {
    setConfig((currentConfig) => ({
      ...currentConfig,
      mainAreaMode: mode,
      allowSplit: mode === 'split' || mode === 'split-tabs',
      allowTabs: mode === 'tabs' || mode === 'split-tabs',
    }));
  }

  /**
   * 切换标签内容类型是否启用。
   * @param type 标签内容类型。
   */
  function toggleTabContent(type: TabContentType) {
    setConfig((currentConfig) => {
      const exists = currentConfig.enabledTabContents.includes(type);
      const nextEnabledTabContents = exists
        ? currentConfig.enabledTabContents.filter((item) => item !== type)
        : [...currentConfig.enabledTabContents, type];
      const safeEnabledTabContents = nextEnabledTabContents.length > 0
        ? nextEnabledTabContents
        : [currentConfig.defaultTabContent];
      const nextDefault = safeEnabledTabContents.includes(currentConfig.defaultTabContent)
        ? currentConfig.defaultTabContent
        : safeEnabledTabContents[0];

      return {
        ...currentConfig,
        enabledTabContents: safeEnabledTabContents,
        defaultTabContent: nextDefault,
      };
    });
  }

  /**
   * 设置默认标签内容。
   * @param type 标签内容类型。
   */
  function setDefaultTabContent(type: TabContentType) {
    setConfig((currentConfig) => ({
      ...currentConfig,
      defaultTabContent: type,
      enabledTabContents: currentConfig.enabledTabContents.includes(type)
        ? currentConfig.enabledTabContents
        : [...currentConfig.enabledTabContents, type],
    }));
  }

  /**
   * 重置为当前预设。
   */
  function resetCurrentPreset() {
    setConfig(cloneTemplateConfig(createPresetConfig(presetId)));
  }

  const configJson = JSON.stringify(config, null, 2);
  const activePreset = presetOptions.find((option) => option.id === presetId) ?? presetOptions[0];

  return (
    <div className="app-shell">
      <section className="app-hero">
        <div className="app-hero__copy">
          <span className="app-badge">Main UI Kit / Template Generator</span>
          <h1>工作台模板生成器预览台</h1>
          <p>
            当前仓库内直接展示 `ide-workbench` 模板能力：元素开关、主区域模式、标签内容类型、设置页、快捷键页与两套预设。
          </p>
        </div>
        <div className="app-hero__actions">
          <button type="button" onClick={resetCurrentPreset}>重置当前预设</button>
          <a href="./docs/TEMPLATE_GENERATOR.md">查看模板文档</a>
        </div>
      </section>

      <section className="control-panel">
        <article className="control-card">
          <h2>预设</h2>
          <div className="button-group">
            {presetOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={presetId === option.id ? 'is-active' : ''}
                onClick={() => setPresetId(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
          <p>{activePreset.description}</p>
        </article>

        <article className="control-card">
          <h2>主区域模式</h2>
          <div className="button-group">
            {mainAreaModes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={config.mainAreaMode === mode ? 'is-active' : ''}
                onClick={() => setMainAreaMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </article>

        <article className="control-card">
          <h2>元素开关</h2>
          <div className="chip-grid">
            {workbenchElementKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={config.elements[key] ? 'chip is-active' : 'chip'}
                onClick={() => toggleElement(key)}
              >
                {workbenchElementLabels[key]}
              </button>
            ))}
          </div>
        </article>

        <article className="control-card">
          <h2>标签内容</h2>
          <div className="chip-grid">
            {tabContentTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={config.enabledTabContents.includes(type) ? 'chip is-active' : 'chip'}
                onClick={() => toggleTabContent(type)}
              >
                {tabContentLabels[type]}
              </button>
            ))}
          </div>
          <div className="button-group button-group--compact">
            {config.enabledTabContents.map((type) => (
              <button
                key={type}
                type="button"
                className={config.defaultTabContent === type ? 'is-active' : ''}
                onClick={() => setDefaultTabContent(type)}
              >
                默认：{tabContentLabels[type]}
              </button>
            ))}
          </div>
        </article>

        <article className="control-card control-card--code">
          <h2>生成命令与配置快照</h2>
          <p>可直接用以下命令生成当前方向的模板工程：</p>
          <div className="command-block">
            <span>pnpm mui-template init demo-workbench --preset={presetId}</span>
            <span>pnpm mui-template init custom-workbench --config=./main-ui.template.json</span>
          </div>
          <pre>{configJson}</pre>
        </article>
      </section>

      <WorkbenchPreview config={config} />
    </div>
  );
}

export default App;
