/** @type {import('tailwindcss').Config} */
import themeConfig from './src/theme';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary - Forest Green (from ambertalefarms reference)
        primary: {
          DEFAULT: themeConfig.colors.primary.main,
          light: themeConfig.colors.primary.light,
          dark: themeConfig.colors.primary.dark,
          50: '#f0f5f2',
          100: '#dcebe0',
          200: '#b8d8c1',
          300: '#8ebf9a',
          400: '#5a9d6b',
          500: themeConfig.colors.primary.main,
          600: '#276e43',
          700: themeConfig.colors.primary.dark,
          800: '#143020',
          900: '#0a1f15',
        },
        // Secondary - Earth Brown
        secondary: {
          DEFAULT: themeConfig.colors.secondary.main,
          light: themeConfig.colors.secondary.light,
          dark: themeConfig.colors.secondary.dark,
        },
        // Accent - Golden/Amber
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
        },
        // Text
        text: {
          primary: themeConfig.colors.text.primary,
          secondary: themeConfig.colors.text.secondary,
          tertiary: themeConfig.colors.text.tertiary,
          light: themeConfig.colors.text.light,
          white: themeConfig.colors.text.white,
        },
        // Status
        success: themeConfig.colors.status.success,
        warning: themeConfig.colors.status.warning,
        error: themeConfig.colors.status.error,
      },
      fontFamily: {
        heading: [themeConfig.typography.heading],
        body: [themeConfig.typography.body],
      },
      maxWidth: {
        container: '1400px',
      },
      boxShadow: {
        premium: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'premium-sm': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}