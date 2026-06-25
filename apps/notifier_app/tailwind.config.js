/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'System'],
      },
      colors: {
        paper: '#FDFBF7',
        shell: '#F0EBE1',
        ink: '#3A312A',
        muted: '#8B7C71',
        line: '#EAE4DC',
        sage: '#6B7A65',
        urgent: '#D97E69',
        slateping: '#8A95A5',
      },
    },
  },
  plugins: [],
};
