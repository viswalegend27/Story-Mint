/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-once': 'spin 1s linear forwards',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      animation: ['group-hover'],
    },
  },
}