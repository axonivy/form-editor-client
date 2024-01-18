import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'build', chunkSizeWarningLimit: 5000 },
  server: { port: 3000, open: true },
  resolve: {
    alias: {
      path: 'path-browserify',
      '@axonivy/form-editor': resolve(__dirname, '../../packages/editor/src'),
      '@axonivy/form-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
