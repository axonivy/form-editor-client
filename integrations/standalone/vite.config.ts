import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  build: { outDir: 'build', chunkSizeWarningLimit: 5000, rollupOptions: { input: { index: './index.html', mock: './mock.html' } } },
  server: { port: 3000 },
  resolve: {
    alias: {
      path: 'path-browserify',
      '@axonivy/form-editor': resolve(__dirname, '../../packages/editor/src'),
      '@axonivy/form-editor-protocol': resolve(__dirname, '../../packages/protocol/src'),
      '@axonivy/form-editor-core': resolve(__dirname, '../../packages/core/src')
    }
  },
  base: './'
});
