/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        secondary: '#646cff',
        blocks: '#2c2e4c',
        bg: '#222225',
        text: '#f0f0f0',
      },
      fontFamily: {
        sansation: ['sansation', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
