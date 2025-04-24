/**
 * CyberCore Design System
 * A centralized module for managing design tokens and aesthetic consistency
 * VERSION: 1.0.0
 */

class DesignSystem {
  constructor() {
    this.tokens = {
      // Spacing scale (in px)
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
        xxxl: 64,
      },

      // Typography scale (in px)
      typography: {
        fontSizes: {
          xs: 12,
          sm: 14,
          md: 16,
          lg: 18,
          xl: 24,
          xxl: 32,
          xxxl: 48,
        },
        fontWeights: {
          light: 300,
          regular: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        lineHeights: {
          tight: 1.2,
          normal: 1.5,
          loose: 1.8,
        },
        fontFamilies: {
          primary: "'Rajdhani', sans-serif",
          secondary: "'Share Tech Mono', monospace",
          display: "'Orbitron', sans-serif",
        },
      },

      // Z-index scale
      zIndex: {
        base: 1,
        elevated: 10,
        dropdown: 100,
        sticky: 200,
        overlay: 300,
        modal: 400,
        popover: 500,
        toast: 600,
      },

      // Border radius scale (in px)
      borderRadius: {
        none: 0,
        sm: 2,
        md: 4,
        lg: 8,
        pill: 999,
      },

      // Animation timing (in ms)
      animation: {
        quick: 200,
        medium: 400,
        slow: 800,
      },

      // Shadows
      shadows: {
        sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        md: '0 4px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        glow: (color, intensity = 0.7) =>
          `0 0 8px rgba(${color}, ${intensity}), 0 0 16px rgba(${color}, ${intensity / 2})`,
      },

      // Color palette - synced with cyber-colors.scss
      colors: {
        primary: {
          dark: '#0d0221',
          medium: '#27086b',
          light: '#5d12d2',
          accent: '#9900ff',
        },
        secondary: {
          dark: '#02111b',
          medium: '#0b4f6c',
          light: '#01baef',
          accent: '#00ffff',
        },
        neutral: {
          darkest: '#08070d',
          dark: '#1a1a2e',
          medium: '#393a5a',
          light: '#8d8daa',
        },
        state: {
          success: '#00ff9f',
          warning: '#ffaa00',
          error: '#ff2a6d',
          info: '#01c8ef',
        },
      },
    };

    // Apply design tokens to CSS variables
    this.applyTokensToCSS();

    // Initialize themes
    this.initializeThemes();
  }

  /**
   * Apply design tokens as CSS variables
   */
  applyTokensToCSS() {
    const root = document.documentElement;

    // Convert tokens to CSS variables
    Object.entries(this.tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, `${value}px`);
    });

    Object.entries(this.tokens.typography.fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, `${value}px`);
    });

    Object.entries(this.tokens.typography.fontWeights).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value);
    });

    Object.entries(this.tokens.typography.lineHeights).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value);
    });

    Object.entries(this.tokens.typography.fontFamilies).forEach(([key, value]) => {
      root.style.setProperty(`--font-family-${key}`, value);
    });

    Object.entries(this.tokens.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, `${value}px`);
    });

    Object.entries(this.tokens.animation).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, `${value}ms`);
    });

    // Apply color tokens
    Object.entries(this.tokens.colors).forEach(([category, colors]) => {
      Object.entries(colors).forEach(([shade, value]) => {
        root.style.setProperty(`--color-${category}-${shade}`, value);
      });
    });
  }

  /**
   * Initialize theme configurations
   */
  initializeThemes() {
    // Define themes
    this.themes = {
      cyber: {
        primary: '#9900ff',
        secondary: '#00ffff',
        background: '#08070d',
        surface: '#1a1a2e',
        text: '#e0e0e0',
        border: '#393a5a',
      },
      synthwave: {
        primary: '#ff00ff',
        secondary: '#00aaff',
        background: '#1a0030',
        surface: '#2a1058',
        text: '#f0f0f0',
        border: '#5e35b1',
      },
      neonoir: {
        primary: '#ff073a',
        secondary: '#07c8ff',
        background: '#0d0d0d',
        surface: '#1d1d1d',
        text: '#f2f2f2',
        border: '#2d2d2d',
      },
    };

    // Set default theme
    this.setTheme('cyber');

    // Check for user preference
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('cybercore-theme');
      if (savedTheme && this.themes[savedTheme]) {
        this.setTheme(savedTheme);
      }
    }
  }

  /**
   * Set the active theme
   * @param {string} themeName - The name of the theme to apply
   */
  setTheme(themeName) {
    if (!this.themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    const root = document.documentElement;
    const theme = this.themes[themeName];

    // Apply theme colors to CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Update data attribute for theme-specific CSS
    root.setAttribute('data-theme', themeName);

    // Store current theme
    this.currentTheme = themeName;

    // Save user preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cybercore-theme', themeName);
    }

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: themeName } }));
  }

  /**
   * Get spacing value with unit
   * @param {string} size - Size key (xs, sm, md, lg, xl, xxl, xxxl)
   * @returns {string} CSS spacing value with px unit
   */
  spacing(size) {
    return `var(--spacing-${size})`;
  }

  /**
   * Get font size with unit
   * @param {string} size - Size key (xs, sm, md, lg, xl, xxl, xxxl)
   * @returns {string} CSS font-size value with px unit
   */
  fontSize(size) {
    return `var(--font-size-${size})`;
  }

  /**
   * Get scaled shadow based on elevation
   * @param {string} elevation - Shadow elevation (sm, md, lg)
   * @returns {string} CSS shadow value
   */
  shadow(elevation) {
    return this.tokens.shadows[elevation] || this.tokens.shadows.md;
  }

  /**
   * Generate glow effect
   * @param {string} color - Color in hex format or CSS variable
   * @param {number} intensity - Glow intensity (0-1)
   * @returns {string} CSS shadow for glow effect
   */
  glow(color, intensity = 0.7) {
    // Convert hex to rgb if needed
    let rgbColor = color;
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      rgbColor = `${r}, ${g}, ${b}`;
    }

    return this.tokens.shadows.glow(rgbColor, intensity);
  }
}

// Create and export a singleton instance
const designSystem = new DesignSystem();
export default designSystem;
