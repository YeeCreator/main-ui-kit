import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppErrorBoundary } from './AppErrorBoundary';
import { appLogger } from './logger';
import { collectRuntimePerformance } from './performance';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('未找到根节点 #root');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);

void collectRuntimePerformance(3000).then((snapshot) => {
  appLogger.info('启动后性能快照', snapshot);
});
