/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5A41A9',
          50: '#F0EDF9',
          100: '#DDD7F2',
          200: '#BDB0E6',
          300: '#9C88D9',
          400: '#7B61CC',
          500: '#5A41A9',
          600: '#4A3590',
          700: '#3A2970',
          800: '#2A1D50',
          900: '#1A1130',
        },
        secondary: '#7C3AED',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Almarai', 'sans-serif'],
      },
      boxShadow: {
        sidebar: '4px 0 24px rgba(0,0,0,0.06)',
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

