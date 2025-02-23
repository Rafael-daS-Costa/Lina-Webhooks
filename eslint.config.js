module.exports = [
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      'prefer-const': 'error',
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'max-len': ['error', { 'code': 90 }],
      'quotes': ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'no-unused-vars': 'error'
    },
  }
];
