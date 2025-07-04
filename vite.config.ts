import { defineConfig } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(),
    legacy({
      targets: ['Android >= 4.4', 'Chrome >= 49', 'not dead'],
      renderModernChunks: false,
      renderLegacyChunks: true,
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'object.hasown/auto',
      ],
      polyfills: true,
    }),
  ],
  esbuild: {
    target: 'es2015',
    include: /\.(ts|jsx|tsx)$/,
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome61',
    minify: false,
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
});
