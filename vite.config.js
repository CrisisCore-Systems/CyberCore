import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const config = {
    root: '.',
    base: '/',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            'core-bundle': [
              './assets/neural-bus.js',
              './assets/performance-manager.js',
              './assets/coherence-persistence.js',
            ],
            'webgl-bundle': [
              './assets/quantum-webgl.js',
              './assets/qear-webgl-bridge.js',
              './assets/hologram-renderer.js',
              './assets/glitch-engine.js',
            ],
            vendor: [
              // Put third-party packages here
            ],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'assets'),
        '@core': path.resolve(__dirname, 'Core'),
      },
    },
    plugins: [],
  };

  // Add visualizer plugin when in analyze mode
  if (process.env.ANALYZE) {
    config.plugins.push(
      visualizer({
        filename: 'stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return config;
});
