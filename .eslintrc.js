const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    semi: [ERROR, 'always'],
    'space-infix-ops': ERROR,
    'prefer-spread': ERROR,
    'no-multi-spaces': ERROR,
    'class-methods-use-this': WARNING,
    'arrow-parens': [ERROR, 'as-needed'],
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/no-unused-vars': ERROR,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/ban-types': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-member-accessibility': OFF,
    '@typescript-eslint/no-namespace': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    'react/display-name': OFF,
    'react/prop-types': OFF,
    'react/react-in-jsx-scope': OFF,
  },
};
