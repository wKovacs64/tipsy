module.exports = {
  env: {
    'cypress/globals': true,
  },
  plugins: ['cypress'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
  parserOptions: {
    project: 'cypress/tsconfig.json',
  },
};
