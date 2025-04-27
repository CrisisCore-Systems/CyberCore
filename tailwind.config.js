/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './templates/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './layout/**/*.liquid',
    './assets/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Core system colors
        primary: 'var(--vb-profile-primary, var(--vb-color-primary))',
        secondary: 'var(--vb-profile-secondary, var(--vb-color-secondary))',
        accent: 'var(--vb-profile-accent, var(--vb-color-accent))',
        background: 'var(--vb-profile-background, var(--vb-color-background))',
        foreground: 'var(--vb-profile-text, var(--vb-color-text))',
        surface: 'var(--vb-profile-surface, var(--vb-color-surface))',
        error: 'var(--vb-color-error)',
        success: 'var(--vb-color-success)',

        // Commerce-specific colors
        'price-increase': 'var(--color-price-increase)',
        'price-decrease': 'var(--color-price-decrease)',
        'quantum-flux': 'var(--color-quantum-flux)',
        'coherence-high': 'var(--color-coherence-high)',
        'coherence-medium': 'var(--color-coherence-medium)',
        'coherence-low': 'var(--color-coherence-low)',

        // Trauma colors - direct access to trauma colors
        trauma: {
          abandonment: 'var(--vb-color-trauma-abandonment)',
          fragmentation: 'var(--vb-color-trauma-fragmentation)',
          surveillance: 'var(--vb-color-trauma-surveillance)',
          recursion: 'var(--vb-color-trauma-recursion)',
          displacement: 'var(--vb-color-trauma-displacement)',
          dissolution: 'var(--vb-color-trauma-dissolution)',
        },

        // Void spectrum - base dimensional fabric
        void: {
          50: '#f5f5f6',
          100: '#e6e7ea',
          200: '#c6c8cf',
          300: '#a2a5b2',
          400: '#7d8094',
          500: '#5d5f70',
          600: '#4a4b59',
          700: '#38394c',
          800: '#232335',
          850: '#1b1b2a',
          900: '#131321',
          950: '#0c0c14',
        },
      },
      boxShadow: {
        // Trauma-specific shadows - now accessing the color through the vb- variable system
        'trauma-abandonment': '0 0 15px var(--vb-color-trauma-abandonment)',
        'trauma-fragmentation': '0 0 15px var(--vb-color-trauma-fragmentation)',
        'trauma-surveillance': '0 0 15px var(--vb-color-trauma-surveillance)',
        'trauma-recursion': '0 0 15px var(--vb-color-trauma-recursion)',
        'trauma-displacement': '0 0 15px var(--vb-color-trauma-displacement)',
        'trauma-dissolution': '0 0 15px var(--vb-color-trauma-dissolution)',

        // Profile-specific glow
        'profile-glow':
          '0 0 calc(var(--vb-glow-intensity) * 8px) var(--vb-profile-primary, var(--vb-color-primary))',
      },
      fontFamily: {
        primary: 'var(--vb-font-primary)',
        secondary: 'var(--vb-font-secondary)',
        display: 'var(--vb-font-display)',
      },
      fontSize: {
        xs: 'var(--vb-font-size-xs)',
        sm: 'var(--vb-font-size-sm)',
        md: 'var(--vb-font-size-md)',
        lg: 'var(--vb-font-size-lg)',
        xl: 'var(--vb-font-size-xl)',
        '2xl': 'var(--vb-font-size-xxl)',
        '3xl': 'var(--vb-font-size-xxxl)',
      },
      borderRadius: {
        sm: 'var(--vb-border-radius-sm)',
        md: 'var(--vb-border-radius-md)',
        lg: 'var(--vb-border-radius-lg)',
        full: 'var(--vb-border-radius-circle)',
      },
      borderWidth: {
        thin: 'var(--vb-border-width-thin)',
        normal: 'var(--vb-border-width-normal)',
        thick: 'var(--vb-border-width-thick)',
      },
      spacing: {
        xs: 'var(--vb-space-xs)',
        sm: 'var(--vb-space-sm)',
        md: 'var(--vb-space-md)',
        lg: 'var(--vb-space-lg)',
        xl: 'var(--vb-space-xl)',
        '2xl': 'var(--vb-space-xxl)',
      },
      zIndex: {
        base: 'var(--vb-z-index-base)',
        elevated: 'var(--vb-z-index-elevated)',
        dropdown: 'var(--vb-z-index-dropdown)',
        sticky: 'var(--vb-z-index-sticky)',
        overlay: 'var(--vb-z-index-overlay)',
        modal: 'var(--vb-z-index-modal)',
        popover: 'var(--vb-z-index-popover)',
        toast: 'var(--vb-z-index-toast)',
      },
      animation: {
        // Core animations
        'fade-in':
          'vb-fade-in var(--vb-animation-speed-medium) var(--vb-animation-easing-entrance) forwards',
        'fade-out':
          'vb-fade-out var(--vb-animation-speed-medium) var(--vb-animation-easing-exit) forwards',
        pulse:
          'vb-pulse var(--vb-animation-speed-slow) var(--vb-animation-easing-default) infinite',
        spin: 'vb-spin var(--vb-animation-speed-very-slow) linear infinite',
        float:
          'vb-float calc(var(--vb-animation-speed-very-slow) * 2) var(--vb-animation-easing-default) infinite',

        // Glitch animations
        'glitch-text':
          'vb-glitch-text calc(var(--vb-animation-speed-medium) * var(--vb-glitch-intensity, 1)) steps(1) infinite',
        'glitch-horizontal':
          'vb-glitch-horizontal calc(var(--vb-animation-speed-medium) * var(--vb-glitch-intensity, 1)) steps(1) infinite',
        'glitch-vertical':
          'vb-glitch-vertical calc(var(--vb-animation-speed-medium) * var(--vb-glitch-intensity, 1)) steps(1) infinite',
        'glitch-skew':
          'vb-glitch-skew calc(var(--vb-animation-speed-fast) * var(--vb-glitch-intensity, 1)) ease-in-out infinite',

        // Trauma animations
        'trauma-flicker':
          'vb-trauma-flicker calc(var(--vb-animation-speed-slow) * var(--vb-trauma-intensity, 0.7)) steps(1) infinite',
        'trauma-abandonment': 'vb-trauma-abandonment 4s ease-in-out infinite',
        'trauma-fragmentation': 'vb-trauma-fragmentation 2s ease-in-out infinite',
        'trauma-recursion': 'vb-trauma-recursion 6s linear infinite',
        'trauma-surveillance': 'vb-trauma-surveillance 3s ease-in-out infinite',
        'trauma-displacement': 'vb-trauma-displacement 3s ease-in-out infinite',
        'trauma-dissolution': 'vb-trauma-dissolution 5s ease-in-out infinite alternate',

        // Quantum animations
        'quantum-pulse':
          'vb-quantum-pulse calc(var(--vb-animation-speed-slow) * 1.5) infinite alternate ease-in-out',
        'quantum-entrance':
          'vb-quantum-entrance var(--vb-animation-speed-medium) var(--vb-animation-easing-entrance) forwards',
        'quantum-glitch':
          'vb-quantum-glitch calc(var(--vb-animation-speed-fast) * 0.8) step-end infinite',
      },
      keyframes: {
        // We don't need to redefine keyframes here as they're all in vb-animations.css
        // This is just a reference to Tailwind that they exist
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),

    // Accessibility focus styles plugin
    plugin(({ addUtilities }) => {
      const focusStyles = {
        // Enhanced focus styles for buttons and interactive elements
        '.focus-visible-ring': {
          '@apply focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2':
            {},
          'outline-offset': '3px',
          'box-shadow': '0 0 0 4px rgba(0, 246, 255, 0.3)',
          'z-index': '1',
        },

        // Button focus styles that match hover states
        '.focus-visible-button': {
          '@apply focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:bg-opacity-20 focus-visible:-translate-y-1':
            {},
          transition: 'all 0.2s ease',
        },

        // Form input focus styles
        '.focus-visible-input': {
          '@apply focus-visible:ring-2 focus-visible:ring-opacity-50 focus-visible:border-primary':
            {},
          'box-shadow': '0 0 0 4px rgba(0, 246, 255, 0.2)',
        },

        // Link focus styles with underline
        '.focus-visible-link': {
          '@apply focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:underline': {},
          'text-decoration-thickness': '2px',
          'text-underline-offset': '3px',
        },

        // Card and container focus styles
        '.focus-visible-card': {
          '@apply focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-opacity-100 focus-visible:-translate-y-2':
            {},
          'box-shadow': '0 0 15px rgba(0, 246, 255, 0.5)',
        },
      };

      addUtilities(focusStyles);
    }),

    // Custom Trauma Encoding plugin
    plugin(({ addUtilities }) => {
      // Add trauma-responsive utilities
      const traumaUtilities = {
        '.trauma-text-glitch': {
          position: 'relative',
          display: 'inline-block',
          '&::before, &::after': {
            content: 'attr(data-text)',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            opacity: 'calc(0.8 * var(--vb-trauma-intensity, 0.7))',
          },
          '&::before': {
            left: 'calc(-2px * var(--vb-trauma-intensity, 0.7))',
            textShadow: '-1px 0 var(--vb-color-trauma-fragmentation)',
          },
          '&::after': {
            left: 'calc(2px * var(--vb-trauma-intensity, 0.7))',
            textShadow: '1px 0 var(--vb-color-trauma-surveillance)',
          },
        },

        // Trauma glow helpers
        '.trauma-glow-abandonment': {
          boxShadow:
            '0 0 calc(8px * var(--vb-trauma-intensity, 0.7)) var(--vb-color-trauma-abandonment)',
        },
        '.trauma-glow-fragmentation': {
          boxShadow:
            '0 0 calc(8px * var(--vb-trauma-intensity, 0.7)) var(--vb-color-trauma-fragmentation)',
        },
        '.trauma-glow-surveillance': {
          boxShadow:
            '0 0 calc(8px * var(--vb-trauma-intensity, 0.7)) var(--vb-color-trauma-surveillance)',
        },
        '.trauma-glow-recursion': {
          boxShadow:
            '0 0 calc(8px * var(--vb-trauma-intensity, 0.7)) var(--vb-color-trauma-recursion)',
        },
        '.trauma-glow-displacement': {
          boxShadow:
            '0 0 calc(8px * var(--vb-trauma-intensity, 0.7)) var(--vb-color-trauma-displacement)',
        },
        '.trauma-glow-dissolution': {
          boxShadow:
            '0 0 calc(8px * var(--vb-trauma-intensity, 0.7)) var(--vb-color-trauma-dissolution)',
        },
      };

      addUtilities(traumaUtilities);
    }),
  ],

  // Safelist for PurgeCSS - classes that should never be purged
  safelist: [
    // Data attributes
    { pattern: /^data-vb-profile-/ },
    { pattern: /^data-vb-trauma-/ },
    { pattern: /^data-vb-quantum-/ },
    { pattern: /^data-vb-glitch-/ },
    { pattern: /^data-vb-interaction-/ },

    // Core classes
    { pattern: /^vb-/ },

    // Animation classes
    { pattern: /^vb-animate-/ },
    { pattern: /^vb-animation-/ },
    { pattern: /^vb-trauma-/ },
    { pattern: /^vb-glitch-/ },
    { pattern: /^vb-quantum-/ },
    { pattern: /^vb-phase-/ },
    { pattern: /^vb-bloom-/ },
    { pattern: /^vb-glow-/ },

    // State classes
    { pattern: /^vb-(is|has)-/ },
    'vb-animate-trauma-flicker',
    'vb-animate-quantum-pulse',
    'vb-animate-quantum-entrance',
    'vb-animate-phase-transition',
    'vb-animate-bloom-pulsate',
    'vb-animate-bloom-dissolve',

    // Interactive states
    'active',
    'focus',
    'hover',
    'focus-visible',
    'group-hover',
    'focus-within',
    'vb-quantum--active',
    'vb-quantum--inactive',
    'vb-trauma--subtle',
    'vb-trauma--medium',
    'vb-trauma--intense',
    'vb-glitch--subtle',
    'vb-glitch--medium',
    'vb-glitch--intense',
    'vb-glow--subtle',
    'vb-glow--medium',
    'vb-glow--intense',
  ],

  // Enable JIT mode for better performance
  mode: 'jit',
};
