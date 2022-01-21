module.exports = {
  extends: [
    'alloy',
    'alloy/react',
    'alloy/typescript',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    /**
     * the global variable in the project and value is false, indicate that the variable can not be re-assign
     */
    __dirname: false,
  },
  rules: {
    'no-undefined': 'warn',
    'no-debugger': 'off',
    complexity: ['error', { max: 99 }],
    // the personalize configurations of your project, such as: @fixable, an indent must be replaced by two spaces
    indent: [
      1,
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true,
      },
    ],
    // @fixable: the children of jsx mush have two spaces
    'react/jsx-indent': [1, 2],
    // @fixable: the props of jsx mush have two spaces jsx
    'react/jsx-indent-props': [1, 2],
    'react/no-string-refs': 1, // don't use ref
    'no-template-curly-in-string': 1, // don't use template string in plain string
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-duplicate-imports': 'off',
    'react/no-unsafe': 'off',
    '@typescript-eslint/no-invalid-this': 'off',
    'react/jsx-key': 0,
    'no-undef': 0,
  },
};
