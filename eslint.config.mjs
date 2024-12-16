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
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  // React recommended configs
  {
    name: 'eslint-plugin-react/configs/recommended',
    ...reactRecommended
  },
  {
    name: 'eslint-plugin-react/configs/jsx-runtime',
    ...reactJsxRuntime
  },
  {
    name: 'eslint-plugin-react',
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
  {
    name: 'eslint-plugin-react-hooks',
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  },
  {
    name: 'eslint-plugin-react-compiler',
    plugins: {
      'react-compiler': reactCompiler
    },
    rules: {
      'react-compiler/react-compiler': 'error'
    }
  },

  // Project-specific overrides and custom rules
  {
    name: 'ingored-files',
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
  {
    name: 'packages/core',
    files: ['packages/core/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
);
