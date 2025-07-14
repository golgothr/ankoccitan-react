import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Configuration de base pour tous les fichiers
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2020: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Règles TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Règles React
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Règles générales
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Désactivé car géré par TypeScript
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Configuration spécifique pour les fichiers de configuration
  {
    files: [
      '**/*.config.{js,ts}',
      'vite.config.ts',
      'vitest.config.ts',
      'cypress.config.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },

  // Configuration pour les fichiers de test
  {
    files: [
      '**/*.test.{js,ts,jsx,tsx}',
      '**/*.spec.{js,ts,jsx,tsx}',
      '**/__tests__/**/*',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Configuration pour les fichiers de développement uniquement
  {
    files: ['src/dev-only/**/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Configuration pour les fichiers de test setup
  {
    files: ['src/core/test/**/*', 'src/test/**/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Fichiers à ignorer
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '.storybook/**',
      'cypress/videos/**',
      'cypress/screenshots/**',
    ],
  },
];
