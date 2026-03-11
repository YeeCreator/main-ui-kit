import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 生成模板后的 Vite 配置。
 */
export default defineConfig({
  plugins: [react()],
});
