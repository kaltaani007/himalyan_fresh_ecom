// Theme Configuration - Single Source of Truth for All UI
// Reference: ambertalefarms.com - Clean, elegant, nature-focused

export const theme = {
  // Primary Colors - Nature/Forest Green Theme
  colors: {
    primary: {
      main: '#2d5a3d',        // Forest green - main brand color
      light: '#3d7a52',       // Lighter green
      dark: '#1a3d28',         // Darker green
      accent: '#4a9063',       // Accent green
    },
    // Secondary - Warm Earth Tones
    secondary: {
      main: '#8b5a2b',        // Warm brown
      light: '#a67c52',       // Light brown
      dark: '#5d3d1f',        // Dark brown
      accent: '#cd7d54',       // Terracotta accent
    },
    // Accent - Golden/Saffron
    accent: {
      main: '#d4a84b',        // Golden amber
      light: '#e8c97a',       // Light gold
      dark: '#b8860b',        // Dark gold
      yellow: '#e89c14',      // Saffron yellow
    },
    // Backgrounds
    background: {
      primary: '#ffffff',      // Pure white
      secondary: '#fdfcfa',   // Warm white/cream
      tertiary: '#f8f6f2',    // Light cream
      dark: '#1a1a1a',        // Dark background
      darkSecondary: '#2d2d2d', // Dark secondary
    },
    // Text Colors
    text: {
      primary: '#1a1a1a',     // Near black
      secondary: '#4a4a4a',   // Dark gray
      tertiary: '#6b6b6b',    // Medium gray
      light: '#9ca3af',       // Light gray
      white: '#ffffff',       // White
      muted: '#6b7280',       // Muted text
    },
    // Status Colors
    status: {
      success: '#059669',     // Green
      warning: '#d97706',     // Amber
      error: '#dc2626',       // Red
      info: '#0284c7',        // Blue
    },
    // Borders
    border: {
      light: '#e5e5e5',
      medium: '#d4d4d4',
      dark: '#404040',
    }
  },

  // Typography
  typography: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
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
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Border Radius
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },

  // Z-Index
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  }
};

// CSS Variables for global use
export const cssVariables = `
  :root {
    /* Primary - Forest Green */
    --color-primary: ${theme.colors.primary.main};
    --color-primary-light: ${theme.colors.primary.light};
    --color-primary-dark: ${theme.colors.primary.dark};
    --color-primary-accent: ${theme.colors.primary.accent};

    /* Secondary - Earth Tones */
    --color-secondary: ${theme.colors.secondary.main};
    --color-secondary-light: ${theme.colors.secondary.light};
    --color-secondary-dark: ${theme.colors.secondary.dark};

    /* Accent - Golden */
    --color-accent: ${theme.colors.accent.main};
    --color-accent-light: ${theme.colors.accent.light};
    --color-accent-dark: ${theme.colors.accent.dark};
    --color-accent-yellow: ${theme.colors.accent.yellow};

    /* Backgrounds */
    --bg-primary: ${theme.colors.background.primary};
    --bg-secondary: ${theme.colors.background.secondary};
    --bg-tertiary: ${theme.colors.background.tertiary};
    --bg-dark: ${theme.colors.background.dark};
    --bg-dark-secondary: ${theme.colors.background.darkSecondary};

    /* Text */
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --text-tertiary: ${theme.colors.text.tertiary};
    --text-light: ${theme.colors.text.light};
    --text-white: ${theme.colors.text.white};

    /* Typography */
    --font-heading: ${theme.typography.heading};
    --font-body: ${theme.typography.body};

    /* Shadows */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};
    --shadow-2xl: ${theme.shadows['2xl']};

    /* Radius */
    --radius-sm: ${theme.radius.sm};
    --radius-md: ${theme.radius.md};
    --radius-lg: ${theme.radius.lg};
    --radius-xl: ${theme.radius.xl};
    --radius-2xl: ${theme.radius['2xl']};
    --radius-full: ${theme.radius.full};
  }
`;

// Helper function to get theme value
export const getTheme = (path: string) => {
  const keys = path.split('.');
  let value: any = theme;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export default theme;