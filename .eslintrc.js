module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
  }
};
