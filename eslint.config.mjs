import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHook from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import _import from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
  allConfig: pluginJs.configs.all
});

export default [
  //general
  { name: 'eslint/js/recommended', ...pluginJs.configs.recommended },
  {
    name: 'formEditor/global/ignores',
    ignores: [
      '**/node_modules',
      '**/lib',
      '**/*.d.ts',
      '**/.eslintrc.*js',
      '**/vite.*.ts',
      '**/vitest.config.ts',
      '**/schemaCodegen.cjs',
      '**/playwright.*.ts'
    ]
  },

  //rules regarding typescript
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(tseslint.plugin),
      import: fixupPluginRules(_import)
    },

    languageOptions: {
      globals: {
        ...globals.browser
      },

      parser: tseslint.parser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },

      'import/resolver': {
        typescript: {}
      },

      react: {
        version: 'detect'
      }
    },

    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-namespace': 'off',
      'react/display-name': 'off'
    }
  },
  ...fixupConfigRules(compat.extends('plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript')),

  //rules regarding react
  { name: 'react/recommended', ...pluginReact.configs.flat.recommended },
  {
    name: 'react-hooks/recommended',
    plugins: {
      'react-hooks': pluginReactHook
    },
    rules: pluginReactHook.configs.recommended.rules
  },

  //individual rules for sections
  {
    name: 'formEditor/packages/core',
    files: ['packages/core/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    },
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        tsconfigRootDir: 'D:\\axonIvy\\master\\form-editor-client\\packages\\core',
        project: 'tsconfig.json'
      }
    }
  },
  {
    name: 'formEditor/packages/protocol',
    files: ['packages/protocol/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        tsconfigRootDir: 'D:\\axonIvy\\master\\form-editor-client\\packages\\protocol',
        project: 'tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    name: 'formEditor/packages/editor',
    files: ['packages/editor/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      'testing-library': testingLibrary
    },
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        tsconfigRootDir: 'D:\\axonIvy\\master\\form-editor-client\\packages\\editor',
        project: 'tsconfig.json'
      }
    }
  },
  {
    name: 'formEditor/integration/standalone',
    files: ['integration/standalone/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        tsconfigRootDir: 'D:\\axonIvy\\master\\form-editor-client\\integrations\\standalone',
        project: 'tsconfig.json'
      }
    }
  },
  {
    name: 'formEditor/playwright',
    files: ['playwright/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        tsconfigRootDir: 'D:\\axonIvy\\master\\form-editor-client\\playwright',
        project: 'tsconfig.json'
      }
    }
  }
];
