/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#E63946',
        accent: '#2DC653',
        background: '#FFF8F0',
        surface: '#FFFFFF',
        dark: '#1A1A2E',
        muted: '#6B7280'
      }
    }
  },
  plugins: []
};
