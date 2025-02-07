import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    sourcemap: 'inline'
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'core',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@axonivy/jsonrpc']
    }
  }
});
