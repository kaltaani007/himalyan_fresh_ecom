/** @type {import('tailwindcss').Config} */
import themeConfig from './src/theme';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary - Mountain Forest Green
        primary: {
          DEFAULT: themeConfig.colors.primary.main,
          light: themeConfig.colors.primary.light,
          dark: themeConfig.colors.primary.dark,
          accent: themeConfig.colors.primary.accent,
          ...themeConfig.colors.primary,
        },
        // Secondary - Himalayan Bark & Earth
        secondary: {
          DEFAULT: themeConfig.colors.secondary.main,
          light: themeConfig.colors.secondary.light,
          dark: themeConfig.colors.secondary.dark,
          accent: themeConfig.colors.secondary.accent,
        },
        // Accent - Golden Harvest
        accent: {
          DEFAULT: themeConfig.colors.accent.main,
          light: themeConfig.colors.accent.light,
          dark: themeConfig.colors.accent.dark,
          yellow: themeConfig.colors.accent.yellow,
        },
        // Backgrounds
        background: {
          primary: themeConfig.colors.background.primary,
          secondary: themeConfig.colors.background.secondary,
          tertiary: themeConfig.colors.background.tertiary,
          dark: themeConfig.colors.background.dark,
          darkSecondary: themeConfig.colors.background.darkSecondary,
          mist: themeConfig.colors.background.mist,
        },
        // Text
        text: {
          primary: themeConfig.colors.text.primary,
          secondary: themeConfig.colors.text.secondary,
          tertiary: themeConfig.colors.text.tertiary,
          light: themeConfig.colors.text.light,
          white: themeConfig.colors.text.white,
          cream: themeConfig.colors.text.cream,
        },
        // Backward-compatibility aliases for existing templates
        pine: {
          50: '#f0f6f2',
          100: '#ddece2',
          200: '#bedbc8',
          500: '#1e4631',
          600: '#173b28',
          700: '#1e4631',
          800: '#0f2619',
          900: '#06130b',
        },
        charcoal: {
          100: '#e8e5dc',
          200: '#d8d3c5',
          300: '#b8c4ba',
          400: '#9daaa1',
          500: '#6f7e73',
          600: '#526156',
          700: '#424f46',
          800: '#26332a',
          900: '#141c16',
        },
        cream: {
          50: '#fbf8f3',
          100: '#f3ede2',
          200: '#e8dfce',
        },
        // Status
        success: themeConfig.colors.status.success,
        warning: themeConfig.colors.status.warning,
        error: themeConfig.colors.status.error,
      },
      fontFamily: {
        heading: ["'Playfair Display'", 'Georgia', 'serif'],
        display: ["'Cormorant Garamond'", 'Georgia', 'serif'],
        body: ["'Inter'", 'system-ui', '-apple-system', 'sans-serif'],
        mono: ["'DM Mono'", 'monospace'],
      },
      maxWidth: {
        container: '1440px',
      },
      boxShadow: {
        premium: '0 25px 50px -12px rgba(15, 26, 18, 0.18)',
        'premium-sm': '0 10px 30px -5px rgba(15, 26, 18, 0.1)',
        glow: '0 0 35px rgba(200, 150, 44, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}
