module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    'implicit-dependencies',
    'prettier',
    'react',
    'react-hooks',
    '@typescript-eslint',
    'unused-imports'
  ],
  rules: {
    'react/prop-types': 'OFF',
    'react/display-name': 'WARN',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/no-empty-interface': 'warn',
    // Change errors to warnings for commit hooks
    'react/no-deprecated': 'warn',
    'react/jsx-key': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-empty': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['**/test/**/*.js'],
      env: {
        jest: true,
        browser: true,
        es6: true,
        node: true
      },
      globals: {
        sinon: true
      }
    }
  ]
};
