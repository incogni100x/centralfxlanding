/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        dauphin: ['Dauphin', 'sans-serif'],
      },
      keyframes: {
        'bounce-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      },
      animation: {
        'bounce-float': 'bounce-float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} 