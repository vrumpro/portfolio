import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  base: './',
  publicDir: false,
  server: {
    host: '127.0.0.1', port: 5173, strictPort: true,
    watch: { ignored: ['**/.runtime/**'] },
  },
  preview: { host: '127.0.0.1', port: 4174, strictPort: true },
  build: {
    rollupOptions: {
      input: Object.fromEntries(['index', 'sokolov', 'wikkeo', 'indriver'].map(name => [
        name, fileURLToPath(new URL(`./${name}.html`, import.meta.url)),
      ])),
    },
  },
});
