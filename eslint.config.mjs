import tseslint from 'typescript-eslint';
import config from '@axonivy/eslint-config';
import customRules from './eslint-plugin-custom-rules.mjs';
import i18next from 'eslint-plugin-i18next';

export default tseslint.config(
  ...config.base,
  // TypeScript recommended configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    name: 'form/rules',
    plugins: {
      custom: customRules,
      i18next
    },
    rules: {
      'custom/no-hardcoded-jsx-strings': 'warn',
      'i18next/no-literal-string': [
        'warn',
        {
          markupOnly: false,
          framework: 'react',
          mode: 'jsx-only',
          'should-validate-template': true,
          'jsx-attributes': { include: ['title', 'aria-label', 'label', 'tag-label', 'info', 'description', 'value', 'message'] }
        }
      ]
    }
  },
  {
    name: 'packages/core',
    files: ['packages/core/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    name: 'ignore-files',
    ignores: ['eslint-plugin-custom-rules.mjs', '**/*.test.tsx']
  }
);
