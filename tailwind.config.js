const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        tipsy: '#8d6c9f',
        accent: '#f6d397',
      },
      boxShadow: {
        tipsy: '4px 4px 8px 0px rgba(141, 108, 159, 0.4)',
      },
    },
  },
};
