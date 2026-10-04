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
          accent: {
            orange: '#ea580c', // High contrast CTA accent from ui-ux-pro-max
            orangeHover: '#c2410c',
          },
        },
      },
      fontFamily: {
        heading: ['Outfit', 'Inter', 'sans-serif'],
        sans: ['Inter', 'Work Sans', 'system-ui', '-apple-system', 'sans-serif'],
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
      boxShadow: {
        'tech-sm': '0 1px 3px rgba(0, 114, 255, 0.1)',
        'tech-md': '0 4px 12px rgba(0, 114, 255, 0.12)',
        'tech-lg': '0 10px 25px -5px rgba(0, 114, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
