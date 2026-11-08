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
        library: {
          bg: '#fbfbf8',
          card: '#ffffff',
          darkBg: '#0f1412',
          darkCard: '#17201d',
          primary: '#0f3a2f',
          primaryLight: '#1b5a4a',
          primaryDark: '#08221b',
          accent: '#d4af37',
          accentLight: '#f6e4a6',
          accentDark: '#a38218',
          border: '#e8e5dc',
          darkBorder: '#273430',
          text: '#1c2421',
          textMuted: '#5c6964',
          darkText: '#e8edea',
          darkTextMuted: '#94a39d'
        }
      },
      fontFamily: {
        hind: ['"Hind Siliguri"', 'sans-serif'],
        serif: ['"Noto Serif Bengali"', 'serif']
      },
      boxShadow: {
        'book': '0 12px 30px -8px rgba(15, 58, 47, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'book-lg': '0 20px 40px -10px rgba(15, 58, 47, 0.3), 0 8px 16px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}
