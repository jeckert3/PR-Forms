/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cchp: {
          blue: '#1E4DB7',
          darkblue: '#0F2F7A',
          lightblue: '#E8EFFE',
          teal: '#00AECB',
          gray: '#F5F7FA',
        },
      },
    },
  },
  plugins: [],
};
