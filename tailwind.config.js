/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tsa: {
          navy: {
            950: '#030712',
            900: '#060913',
            850: '#0a101d',
            800: '#0e162a',
            750: '#111c35',
            700: '#172554',
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#0072ff',
            700: '#1d4ed8',
          },
          cyan: {
            300: '#00f2fe',
            400: '#38bdf8',
            500: '#00b0ff',
          },
          surface: {
            dark: '#0a101f',
            card: '#0d1527',
            cardHover: '#111c35',
            border: '#1e293b',
            borderGlow: '#2563eb',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
    },
  },
  plugins: [],
}
