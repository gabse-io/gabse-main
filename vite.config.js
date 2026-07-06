import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: { main: 'index.html', preview: 'preview.html' },
    },
  },
});
