/**
 * 设置页表格数据。
 */
export const settingsRows = [
  {
    section: '布局',
    key: 'workbench.layout.mode',
    value: 'split-tabs',
    description: '定义主区域采用单视口、拆分、标签或拆分标签模式。',
  },
  {
    section: '标签',
    key: 'workbench.tabs.defaultContent',
    value: 'text-editor',
    description: '定义新建标签页的默认内容类型。',
  },
  {
    section: '视口',
    key: 'viewport.2d.engine',
    value: 'pixi',
    description: '声明 2D 模板中默认集成的视口引擎。',
  },
  {
    section: '视口',
    key: 'viewport.3d.engine',
    value: 'three',
    description: '声明 3D 模板中默认集成的视口引擎。',
  },
];

/**
 * 快捷键页表格数据。
 */
export const keybindingRows = [
  { command: 'workbench.newTab', keybinding: 'Ctrl+T', scope: 'Workbench', status: '已绑定' },
  { command: 'workbench.splitPrimary', keybinding: 'Ctrl+\\', scope: 'Editor', status: '已绑定' },
  { command: 'workbench.openSettings', keybinding: 'Ctrl+,', scope: 'Global', status: '已绑定' },
  { command: 'workbench.openKeybindings', keybinding: 'Ctrl+K Ctrl+S', scope: 'Global', status: '冲突检查通过' },
];

/**
 * 侧栏示例模块。
 */
export const sidebarModules = [
  { title: '资源导航', description: '用于挂接文件树、资源库或模型树。' },
  { title: '属性检查器', description: '用于挂接选中对象的属性编辑器。' },
  { title: '任务面板', description: '用于挂接构建、任务、流水线或日志入口。' },
];
