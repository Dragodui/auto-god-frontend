/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        secondary: '#646cff',
        blocks: '#2c2e4c',
      },
      fontFamily: {
        sansation: ['sansation', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
