/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        mirqam: {
          teal: '#23949A',
          'teal-dark': '#177E83',
          'teal-light': '#84D6D8',
          'teal-soft': '#E9F3F4',
          'teal-glow': '#23949a22',
          navy: '#172740',
          dark: '#0A1420',
          'dark-card': '#122033',
          'dark-border': '#1E3248',
          'navy-dark': '#0E1A29',
          'navy-card': '#182B3E',
          'navy-soft': '#203B4A',
          border: '#C9DBDF',
          'border-dark': '#314D60',
          muted: '#556B7D',
          'muted-dark': '#AEC2CE'
        }
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans Arabic"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glass: '0 12px 36px #17274008, 0 2px 5px #17274004',
        'glass-dark': '0 12px 32px #030b1828',
        'glow-teal': '0 0 20px #23949a40'
      },
      borderRadius: {
        glass: '24px'
      }
    },
  },
  plugins: [],
}
