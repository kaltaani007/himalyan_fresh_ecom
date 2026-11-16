// Theme Configuration - Single Source of Truth for Himalayan Fresh UI
// Aesthetic: Mountain Luxury Organic (Reference: Amber Tale Farms & High-End Terroir Estate)

export const theme = {
  // Primary Colors - Deep Mountain Forest Green
  colors: {
    primary: {
      DEFAULT: '#1e4631',    // Rich orchard pine / forest green
      main: '#1e4631',
      light: '#2d6b46',       // Morning sun on pine needles
      dark: '#0f2619',        // Deep forest shadow
      accent: '#439162',      // Fresh sprout green
      50: '#f0f6f2',
      100: '#ddece2',
      200: '#bedbc8',
      300: '#94c2a4',
      400: '#64a27a',
      500: '#1e4631',
      600: '#173b28',
      700: '#123020',
      800: '#0c2216',
      900: '#06130b',
    },
    // Secondary - Himalayan Bark & Warm Earth
    secondary: {
      DEFAULT: '#4a2e1a',     // Deep Himalayan pine bark
      main: '#4a2e1a',
      light: '#70482b',       // Warm orchard timber
      dark: '#2e1c0f',        // Rich mountain loam soil
      accent: '#c97d54',      // Terracotta harvest clay
    },
    // Accent - Golden Harvest & Amber
    accent: {
      DEFAULT: '#c8962c',     // Warm autumnal gold
      main: '#c8962c',
      light: '#e2b34f',       // Afternoon orchard sun
      dark: '#9a7019',        // Aged mountain honey
      yellow: '#f0ab20',      // High-visibility ripe fruit tag
    },
    // Backgrounds - Clean Warm Parchments & Deep Atmospheric Dark
    background: {
      primary: '#ffffff',      // Pure clean white
      secondary: '#fbf8f3',    // Warm alabaster parchment
      tertiary: '#f3ede2',     // Mountain mist linen
      dark: '#0f1a12',         // Deep dusk forest
      darkSecondary: '#192b1e',// Mountain twilight
      mist: '#e8ede9',         // Morning alpine mist
    },
    // Text Colors - High Readability
    text: {
      primary: '#141c16',      // Near black with soft forest undertone
      secondary: '#424f46',    // Slate moss for descriptions
      tertiary: '#6f7e73',     // Muted specifications
      light: '#9daaa1',        // Disabled / struck-through
      white: '#ffffff',        // Contrast text
      cream: '#fbf8f3',        // Warm text on dark backgrounds
    },
    // Status Colors
    status: {
      success: '#1b7a43',      // Verified / in-stock
      warning: '#c88612',      // Low stock / seasonal
      error: '#c0392b',        // Alert / out of stock
      info: '#20639b',         // Information
    },
    // Borders
    border: {
      light: '#e8e5dc',
      medium: '#d8d3c5',
      dark: '#2d3d32',
    }
  },

  // Typography
  typography: {
    heading: "'Playfair Display', Georgia, serif",
    display: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'DM Mono', monospace",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },

  // Spacing & Layout
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },

  // Border Radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(15, 26, 18, 0.06)',
    md: '0 4px 10px -2px rgba(15, 26, 18, 0.08)',
    lg: '0 12px 24px -4px rgba(15, 26, 18, 0.1)',
    xl: '0 20px 32px -6px rgba(15, 26, 18, 0.12)',
    '2xl': '0 30px 60px -12px rgba(15, 26, 18, 0.2)',
    premium: '0 25px 50px -12px rgba(15, 26, 18, 0.18)',
    'premium-sm': '0 10px 30px -5px rgba(15, 26, 18, 0.1)',
    glow: '0 0 35px rgba(200, 150, 44, 0.35)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // Z-Index
  zIndex: {
    base: 0,
    canvas: 10,
    content: 20,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  }
};

export default theme;
