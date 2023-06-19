/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        md1: '0.615rem',
      },
      colors: {
        'my-400': '#4A4A4F',
        '5d5d': '#5D5D6C',
        '2a2b': '#2A2B38',
        '3a3a': '#3A3A49',
        1515: '#15151D',
        primary: '#F3962B',
      },
    },
  },
  plugins: [],
}
