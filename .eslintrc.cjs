module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 4],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-undef': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  globals: {
    'WeakMap': 'readonly',
    'Set': 'readonly',
    'requestAnimationFrame': 'readonly'
  }
};
