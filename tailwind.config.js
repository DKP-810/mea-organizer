/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mea: {
          red: '#A6192E',
          navy: '#1F3864',
          charcoal: '#231F20',
        },
      },
    },
  },
  plugins: [],
}

