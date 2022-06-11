const path = require('path');

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, 'src')],
        ],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  globals: {
    GLOBAL: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  rules: {
    'no-param-reassign': 0,
    'import/no-named-default': 0,
    'import/no-named-as-default': 0,
  },
};
