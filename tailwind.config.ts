import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#E63946',
        accent: '#2DC653',
        background: '#FFF8F0',
        surface: '#FFFFFF',
        dark: '#1A1A2E',
        muted: '#6B7280',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '10px',
        badge: '8px',
        modal: '24px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        elevated: '0 8px 24px rgba(0,0,0,0.12)',
        floating: '0 16px 48px rgba(0,0,0,0.16)',
        'primary-glow': '0 4px 20px rgba(255,107,53,0.35)',
      },
      fontFamily: {
        arabic: ['Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
