/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: 'Poppins',
      },
      lineHeight: {
        'like-btn-lg': '4rem',
        'like-btn-sm': '2rem',
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/line-clamp')],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'light',
  },
};
