/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mea: {
          blue: '#003087',
          gold: '#F5A800',
        },
      },
    },
  },
  plugins: [],
}

