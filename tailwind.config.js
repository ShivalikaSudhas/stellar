/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#080E1B', // Primary background
          900: '#111C2D', // Secondary background
          850: '#142033', 
          800: '#172438', // Card background
          750: '#1D2E47',
          700: '#223552', // Borders
          600: '#31486B',
          500: '#486894',
          400: '#5B6E88',
          300: '#8E9EB5', // Muted text
          200: '#B0C2DE',
          100: '#D5E2F5',
          50: '#F0F5FC'
        },
        cyan: {
          accent: '#36D6E7', // Electric cyan
          glow: 'rgba(54, 214, 231, 0.15)',
        },
        blue: {
          accent: '#568CFF', // Soft blue
          glow: 'rgba(86, 140, 255, 0.15)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          critical: '#EF4444',
          info: '#36D6E7'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
