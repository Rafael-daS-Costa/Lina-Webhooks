module.exports = [
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      'prefer-const': 'error',
      semi: ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'no-unused-vars': 'error',
    },
  },
];
