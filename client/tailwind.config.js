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
        editorial: {
          bg: '#0E0E0E',
          surface: '#141414',
          surfaceElevated: '#1A1A1A',
          card: '#161616',
          border: '#2A2421',
          borderSubtle: '#221D1B',
          borderHighlight: '#3E3430',
          rust: '#D6551F',
          rustHover: '#BF4917',
          rustLight: '#FFB59B',
          rustMuted: 'rgba(214, 85, 31, 0.15)',
          rustDark: '#2F180F',
          textHead: '#F5F3F0',
          textBody: '#A0A0A0',
          textDim: '#666666',
          safe: '#10B981',
          warning: '#F59E0B',
          danger: '#D6551F'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        taberna: ['"Taberna"', '"Taberna Serif"', '"Cinzel"', '"Playfair Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        'rust-glow': '0 0 24px -2px rgba(214, 85, 31, 0.35)',
        'rust-subtle': '0 8px 24px -4px rgba(0, 0, 0, 0.6)',
        'editorial-card': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'editorial-hover': '0 8px 30px -4px rgba(214, 85, 31, 0.18)'
      }
    },
  },
  plugins: [],
}
