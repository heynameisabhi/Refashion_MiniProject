/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#D6F5D6',
          DEFAULT: '#2F855A',
          dark: '#22543D',
        },
      },
    },
  },
  plugins: [],
};

