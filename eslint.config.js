const js = require('@eslint/js');
const globals = require('globals');
module.exports = [
  { ignores: ['node_modules/**', 'reports/**', 'target/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
  {
    files: [
      'tests/support/karate-config.js',
      'tests/support/karate-cleanup.js',
    ],
    languageOptions: {
      globals: { karate: 'readonly', java: 'readonly', Java: 'readonly' },
    },
    rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^fn$' }] },
  },
];
