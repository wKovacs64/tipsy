module.exports = {
  extends: [
    'plugin:wkovacs64/react',
    'plugin:wkovacs64/typescript',
    'plugin:wkovacs64/jest',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: ['emotion'],
  rules: {
    // 'emotion/jsx-import': 'error',
    'emotion/no-vanilla': 'error',
    'emotion/import-from-emotion': 'error',
    'emotion/styled-import': 'error',
    'emotion/syntax-preference': ['error', 'string'],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: ['Label', 'SettingLabel'],
        controlComponents: ['BillInput', 'CalcInput'],
        assert: 'either',
      },
    ],
  },
};
