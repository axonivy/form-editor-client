import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactCompiler, { react } from 'eslint-plugin-react-compiler';
import globals from 'globals';

export default tseslint.config(
  // Base eslint recommended config
  eslint.configs.recommended,

  // TypeScript recommended configs
  ...tseslint.configs.strict,
  {
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  // React recommended configs
  reactRecommended,
  reactJsxRuntime,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/display-name': 'off'
    }
  },

  // React Hooks plugin
  {
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  },

  // React Compiler plugin
  {
    plugins: {
      'react-compiler': reactCompiler
    },
    rules: {
      'react-compiler/react-compiler': 'error'
    }
  },

  // Ignored files
  {
    ignores: [
      '**/node_modules/**',
      'eslint.config.*',
      '**/vite*.config.*',
      '**/playwright.config.*',
      '**/*.d.ts',
      '**/lib/*',
      '**/schemaCodegen.cjs'
    ]
  },

  // Project-specific overrides and custom rules
  { name: 'packages/core', files: ['packages/core/**/*.{js,mjs,cjs,ts,jsx,tsx}'], rules: { '@typescript-eslint/no-explicit-any': 'off' } }
);
