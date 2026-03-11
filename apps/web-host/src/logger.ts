/**
 * 日志级别。
 */
export type LogLevel = 'info' | 'warn' | 'error';

/**
 * 日志条目。
 */
export interface LogEntry {
  /** 时间戳。 */
  timestamp: string;
  /** 日志级别。 */
  level: LogLevel;
  /** 日志消息。 */
  message: string;
  /** 附加上下文。 */
  context?: unknown;
}

/**
 * 应用日志器接口。
 */
export interface AppLogger {
  /** 写入普通日志。 */
  info: (message: string, context?: unknown) => void;
  /** 写入警告日志。 */
  warn: (message: string, context?: unknown) => void;
  /** 写入错误日志。 */
  error: (message: string, context?: unknown) => void;
  /** 获取最新日志。 */
  getRecentLogs: () => LogEntry[];
}

const MAX_LOG_COUNT = 100;
const buffer: LogEntry[] = [];

/**
 * 写入日志并同步输出到控制台。
 * @param level 日志级别。
 * @param message 日志消息。
 * @param context 附加上下文。
 */
function pushLog(level: LogLevel, message: string, context?: unknown): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };

  buffer.push(entry);
  if (buffer.length > MAX_LOG_COUNT) {
    buffer.shift();
  }

  if (level === 'info') {
    console.info(`[scene-kit] ${message}`, context ?? '');
  } else if (level === 'warn') {
    console.warn(`[scene-kit] ${message}`, context ?? '');
  } else {
    console.error(`[scene-kit] ${message}`, context ?? '');
  }
}

/**
 * 创建应用日志器。
 * @returns 日志器实例。
 * @example
 * const logger = createAppLogger();
 * logger.info('应用已启动');
 */
export function createAppLogger(): AppLogger {
  return {
    info: (message: string, context?: unknown) => pushLog('info', message, context),
    warn: (message: string, context?: unknown) => pushLog('warn', message, context),
    error: (message: string, context?: unknown) => pushLog('error', message, context),
    getRecentLogs: () => [...buffer],
  };
}

/**
 * 默认日志器。
 */
export const appLogger = createAppLogger();
