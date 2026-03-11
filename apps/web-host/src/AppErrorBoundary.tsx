import { Component, type ErrorInfo, type ReactNode } from 'react';
import { appLogger } from './logger';

/**
 * 错误边界组件参数。
 */
interface AppErrorBoundaryProps {
  /** 子组件。 */
  children: ReactNode;
}

/**
 * 错误边界组件状态。
 */
interface AppErrorBoundaryState {
  /** 是否发生错误。 */
  hasError: boolean;
}

/**
 * 应用级错误边界。
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  /**
   * 创建错误边界组件。
   * @param props 组件参数。
   */
  public constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * 在错误发生后更新状态。
   * @returns 新状态。
   */
  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * 记录组件错误。
   * @param error 错误对象。
   * @param errorInfo React 错误信息。
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    appLogger.error('捕获到未处理的 React 组件错误', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  /**
   * 渲染组件。
   * @returns 组件节点。
   */
  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="app-shell">
          <section className="card error-card">
            <h1 className="title">页面渲染失败</h1>
            <p>请检查控制台日志并刷新页面。</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
