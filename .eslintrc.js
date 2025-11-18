module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./backend/tsconfig.json', './frontend/tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // General rules
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',

    // React/Next.js specific (for frontend)
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['frontend/**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      plugins: ['react', 'react-hooks', '@typescript-eslint'],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        ...require('./frontend/.eslintrc.js').rules,
      },
    },
    {
      files: ['backend/**/*.ts'],
      env: {
        node: true,
      },
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'prettier',
      ],
      rules: {
        ...require('./backend/.eslintrc.js').rules,
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    '*.config.js',
    'coverage/',
  ],
};