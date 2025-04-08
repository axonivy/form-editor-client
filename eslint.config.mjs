import tseslint from 'typescript-eslint';
import config from '@axonivy/eslint-config';
import i18next from 'eslint-plugin-i18next';

export default tseslint.config(
  ...config.base,
  // TypeScript recommended configs
  {
    name: 'typescript-eslint',
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    name: 'form/rules',
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['**/*.test.{ts,tsx,js,jsx}'],
    plugins: {
      i18next
    },
    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          mode: 'jsx-only',
          'jsx-attributes': { include: ['label', 'aria-label', 'title', 'name'] }
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
  }
);
