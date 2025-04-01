import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  // base: '/rulego-ipaas-ui/',

  plugins: [vue()],
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
});
