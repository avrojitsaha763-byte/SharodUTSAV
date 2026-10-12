/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sindoor: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          400: '#fb7185',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        marigold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        utsav: {
          dark: '#070a13',
          card: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          gold: '#fbbf24',
          crimson: '#e11d48',
          teal: '#0d9488'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        bengali: ['"Anek Bangla"', '"Noto Sans Bengali"', 'sans-serif'],
        serif: ['"Rozha One"', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(245, 158, 11, 0.8), 0 0 40px rgba(225, 29, 72, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
