// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: {
    browser: true,
    node: false,
    commonjs: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    // @todo more restrictive
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
  overrides: [
    {
      files: ['webpack.*.js'],
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};
