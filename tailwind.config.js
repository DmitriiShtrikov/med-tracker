/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gh-bg': '#0d1117',
        'gh-surface': '#161b22',
        'gh-border': '#30363d',
        'gh-text': '#c9d1d9',
        'gh-muted': '#8b949e',
        'gh-blue': '#58a6ff',
        'gh-green': '#238636',
        'gh-green-hover': '#2ea043',
        'gh-red': '#f85149',
        'gh-yellow': '#d29922',
        'gh-subtle': '#21262d',
        'gh-purple': '#a371f7'
      }
    },
  },
  plugins: [],
}