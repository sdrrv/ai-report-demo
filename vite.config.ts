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
      targets: ['Chrome >= 61', 'Firefox >= 60', 'Safari >= 11', 'Edge >= 16'],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/stable',
        'whatwg-fetch', // Add fetch polyfill
      ],
      modernPolyfills: [
        'es.promise',
        'es.array.iterator',
        'es.object.entries',
        'es.object.values',
        'es.object.from-entries',
        'es.string.match-all',
        'es.global-this',
        'es.symbol',
        'es.symbol.iterator',
        'es.weak-map',
        'es.weak-set',
        'es.map',
        'es.set',
      ],
      renderModernChunks: true,
      polyfills: true,
      externalSystemJS: false, // Bundle SystemJS with the app
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  build: {
    target: 'es2015',
    sourcemap: true,
    cssTarget: 'chrome61',
  },
});
