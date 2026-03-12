import { templateConfig } from './generated/templateConfig';
import { WorkbenchShell } from './managed/workbench-shell/WorkbenchShell';

/**
 * 生成模板后的应用入口。
 * @returns React 组件。
 */
function App() {
  return <WorkbenchShell config={templateConfig} />;
}

export default App;
