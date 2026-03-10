import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Web 宿主的 Vite 配置。
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@main-ui-kit/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@main-ui-kit/host-web': resolve(__dirname, '../../packages/host-web/src/index.ts'),
      '@main-ui-kit/mode-canvas': resolve(__dirname, '../../packages/mode-canvas/src/index.ts'),
      '@main-ui-kit/mode-map': resolve(__dirname, '../../packages/mode-map/src/index.ts'),
      '@main-ui-kit/exporter': resolve(__dirname, '../../packages/exporter/src/index.ts'),
      '@main-ui-kit/shared-ui': resolve(__dirname, '../../packages/shared-ui/src/index.tsx'),
    },
  },
});
