import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0EB',
        'cream-dark': '#E8E0D5',
        charcoal: '#2C2C2C',
        'charcoal-light': '#5C5C5C',
        warm: '#8B7355',
        'warm-light': '#C4A882',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wide: '0.05em',
        wider: '0.1em',
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
export default config
