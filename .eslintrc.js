module.exports = {
  extends: [
    'plugin:wkovacs64/react',
    'plugin:wkovacs64/typescript',
    'prettier',
  ],
  rules: {
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: ['Label', 'SettingLabel'],
        controlComponents: ['BillInput', 'CalcInput'],
        assert: 'either',
      },
    ],
    'react/react-in-jsx-scope': 'off',
  },
};
