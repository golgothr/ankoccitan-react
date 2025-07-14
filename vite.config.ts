import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          query: ['@tanstack/react-query'],
          state: ['zustand'],
          utils: ['axios'],
        },
      },
    },
    // Analyse du bundle en mode analyze
    ...(mode === 'analyze' && {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
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
    }),
  },
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
  // Exclure le dossier dev-only en production
  ...(mode === 'production' && {
    build: {
      rollupOptions: {
        external: (id) => {
          return id.includes('src/dev-only/');
        },
      },
    },
  }),
}));
