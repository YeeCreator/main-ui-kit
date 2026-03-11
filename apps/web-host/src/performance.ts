import { appLogger } from './logger';

/**
 * 性能采样结果。
 */
export interface PerformanceSnapshot {
  /** 采样时长（毫秒）。 */
  durationMs: number;
  /** 估算平均 FPS。 */
  avgFps: number;
}

/**
 * 启动性能采样。
 * @param durationMs 采样时长，单位毫秒。
 * @returns 采样 Promise。
 * @example
 * await collectRuntimePerformance(3000);
 */
export async function collectRuntimePerformance(durationMs = 3000): Promise<PerformanceSnapshot> {
  return new Promise<PerformanceSnapshot>((resolve) => {
    const start = performance.now();
    let frameCount = 0;

    const loop = (): void => {
      frameCount += 1;
      const elapsed = performance.now() - start;

      if (elapsed >= durationMs) {
        const avgFps = Number(((frameCount / elapsed) * 1000).toFixed(2));
        const snapshot: PerformanceSnapshot = {
          durationMs: Number(elapsed.toFixed(2)),
          avgFps,
        };
        appLogger.info('性能采样完成', snapshot);
        resolve(snapshot);
        return;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  });
}
