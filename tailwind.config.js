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
          950: '#060B14', // Deepest obsidian space black
          900: '#0B1220', // Midnight space blue
          850: '#0F1A2E', // Dark panel navy
          800: '#15243B', // Card background
          750: '#1C304D',
          700: '#264065', // Border lines
          600: '#3A5A8A',
          500: '#5A7EA8',
          400: '#8CA7C7',
          300: '#B8CCE3',
          200: '#DDE7F3',
          100: '#EFF4FA',
        },
        ivory: {
          DEFAULT: '#F5F2EB', // Signature cream/ivory card from reference image
          card: '#F6F3ED',
          light: '#FAF8F5',
          border: '#E8E2D5',
          dark: '#E2DBD0',
        },
        ink: {
          950: '#060A14', // Extra dark sharp text for ivory cards
          900: '#0A1020',
          800: '#121B30',
          700: '#1E2B45',
          600: '#2F3F5E',
          500: '#4A5D80',
          400: '#6E81A3',
        },
        accent: {
          blue: '#38BDF8', // Cyan/sky blue glow
          cobalt: '#2563EB',
          soft: '#60A5FA',
          coral: '#EF4444', // SOS red/coral
          emerald: '#10B981', // Normal green
          amber: '#F59E0B', // Warning amber
        }
      },
      fontFamily: {
        serif: ['Lora', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'glow-coral': '0 0 30px -5px rgba(239, 68, 68, 0.35)',
        'ivory-card': '0 10px 30px -10px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
