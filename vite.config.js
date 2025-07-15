var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
  var mode = _a.mode;
  return __assign(
    {
      plugins: [react()],
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src'),
          '@core': resolve(__dirname, 'src/core'),
          '@features': resolve(__dirname, 'src/features'),
          '@components': resolve(__dirname, 'src/components'),
          '@layouts': resolve(__dirname, 'src/layouts'),
          '@dev-only': resolve(__dirname, 'src/dev-only'),
        },
      },
      server: {
        port: 3000,
        host: true,
        open: true,
      },
      build: __assign(
        {
          target: 'es2020',
          outDir: 'dist',
          sourcemap: mode === 'development',
          minify: 'terser',
          chunkSizeWarningLimit: 1000,
          rollupOptions: {
            output: {
              manualChunks: {
                'react-vendor': ['react', 'react-dom'],
                'router-vendor': ['react-router-dom'],
                'query-vendor': ['@tanstack/react-query'],
                'supabase-vendor': ['@supabase/supabase-js'],
                'ui-vendor': ['react-icons'],
              },
            },
          },
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        },
        mode === 'analyze' && {
          rollupOptions: {
            output: {
              manualChunks: function (id) {
                if (id.includes('node_modules')) {
                  if (id.includes('react')) return 'react-vendor';
                  if (id.includes('@tanstack')) return 'tanstack';
                  if (id.includes('zustand')) return 'zustand';
                  if (id.includes('axios')) return 'axios';
                  return 'vendor';
                }
              },
            },
          },
        }
      ),
      preview: {
        port: 4173,
        host: true,
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/core/test/setup.ts'],
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html', 'lcov'],
          exclude: [
            'node_modules/',
            'src/core/test/',
            'src/dev-only/', // Exclure le dossier dev-only des tests
            '**/*.d.ts',
            '**/*.config.*',
            '**/*.stories.*',
            '**/*.test.*',
            '**/*.spec.*',
          ],
        },
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          '@tanstack/react-query',
          '@tanstack/react-router',
        ],
      },
    },
    mode === 'production' && {
      build: {
        rollupOptions: {
          external: function (id) {
            return id.includes('src/dev-only/');
          },
        },
      },
    }
  );
});
