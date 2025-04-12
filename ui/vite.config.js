import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  // base: '/rulego-ipaas-ui/',

  plugins: [vue(),svgLoader()],
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
});
