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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
  allConfig: pluginJs.configs.all
});

export default [
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
      '**/playwright.*.ts',
      '**/{node_modules,lib}'
    ]
  },

  { name: 'global language', languageOptions: { globals: globals.browser } },

  { name: 'react/recommended', ...pluginReact.configs.flat.recommended },
  {
    name: 'react-hooks/recommended',
    plugins: {
      'react-hooks': pluginReactHook
    },
    rules: pluginReactHook.configs.recommended.rules
  },
  ...tseslint.configs.recommended,
  ...fixupConfigRules(compat.extends('plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript')),
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
