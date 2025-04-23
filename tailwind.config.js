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
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        surface: 'var(--color-surface)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',

        // Commerce-specific colors
        'price-increase': 'var(--color-price-increase)',
        'price-decrease': 'var(--color-price-decrease)',
        'quantum-flux': 'var(--color-quantum-flux)',
        'coherence-high': 'var(--color-coherence-high)',
        'coherence-medium': 'var(--color-coherence-medium)',
        'coherence-low': 'var(--color-coherence-low)',

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
        // Trauma indicators - emotional resonance markers
        trauma: {
          100: '#ffe5fc',
          200: '#ffc2f0',
          300: '#ff9aea',
          400: '#f45ddc',
          500: '#d721b8',
          600: '#b80d98',
          700: '#930570',
          800: '#6b0752',
          900: '#48083b',
        },
        // Memory phase color indicators
        cyber: {
          100: '#d8f8ff',
          300: '#91ebfd',
          500: '#0ee7ff',
          700: '#09a3b6',
          900: '#057a89',
        },
        alien: {
          100: '#e4ffea',
          300: '#95ffc5',
          500: '#04ff59',
          700: '#03b441',
          900: '#0b6d2a',
        },
        virus: {
          100: '#fff2cc',
          300: '#ffe27a',
          500: '#ffbb38',
          700: '#d99917',
          900: '#8c5600',
        },
      },
      boxShadow: {
        // Trauma-specific shadows
        'trauma-abandonment': 'var(--trauma-abandonment-glow)',
        'trauma-fragmentation': 'var(--trauma-fragmentation-glow)',
        'trauma-surveillance': 'var(--trauma-surveillance-glow)',
        'trauma-recursion': 'var(--trauma-recursion-glow)',
        'trauma-displacement': 'var(--trauma-displacement-glow)',
        'trauma-dissolution': 'var(--trauma-dissolution-glow)',
      },
      fontFamily: {
        primary: 'var(--font-family-primary)',
        secondary: 'var(--font-family-secondary)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        md: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
      },
      borderRadius: {
        sm: 'var(--border-radius-sm)',
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
        xl: 'var(--border-radius-xl)',
      },
      borderWidth: {
        thin: 'var(--border-width-thin)',
        normal: 'var(--border-width-normal)',
        thick: 'var(--border-width-thick)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      animation: {
        'quantum-spin': 'quantum-spin var(--animation-speed-normal) linear infinite',
        'quantum-glitch':
          'quantum-glitch calc(var(--animation-speed-fast) * 0.8) step-end infinite',
        'quantum-pulse': 'quantumPulse var(--animation-speed-slow) infinite alternate ease-in-out',
      },
      keyframes: {
        'quantum-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'quantum-glitch': {
          '0%': { transform: 'translate(0)', opacity: 1 },
          '20%': {
            transform:
              'translate(calc(var(--glitch-intensity) * -5px), calc(var(--glitch-intensity) * 3px))',
            opacity: 0.9,
          },
          '40%': {
            transform:
              'translate(calc(var(--glitch-intensity) * 5px), calc(var(--glitch-intensity) * -3px))',
            opacity: 0.8,
          },
          '60%': {
            transform:
              'translate(calc(var(--glitch-intensity) * -3px), calc(var(--glitch-intensity) * 5px))',
            opacity: 0.9,
          },
          '80%': {
            transform:
              'translate(calc(var(--glitch-intensity) * 3px), calc(var(--glitch-intensity) * -5px))',
            opacity: 0.8,
          },
          '100%': { transform: 'translate(0)', opacity: 1 },
        },
        quantumPulse: {
          '0%': { opacity: 0.1, transform: 'scale(1)' },
          '100%': { opacity: 0.2, transform: 'scale(1.05)' },
        },
        '@keyframes glitch-anim-1': {
          '0%, 100%': { opacity: '0.8', transform: 'none', 'clip-path': 'inset(0 0 0 0)' },
          '20%': { opacity: '1', transform: 'translateX(-5px)', 'clip-path': 'inset(8% 0 13% 0)' },
          '60%': {
            opacity: '0.5',
            transform: 'translateX(5px)',
            'clip-path': 'inset(31% 0 41% 0)',
          },
          '80%': {
            opacity: '0.9',
            transform: 'translateX(2px)',
            'clip-path': 'inset(65% 0 15% 0)',
          },
        },
        '@keyframes glitch-anim-2': {
          '0%, 100%': { opacity: '0.7', transform: 'none', 'clip-path': 'inset(0 0 0 0)' },
          '25%': {
            opacity: '0.8',
            transform: 'translateX(4px)',
            'clip-path': 'inset(33% 0 33% 0)',
          },
          '50%': {
            opacity: '0.6',
            transform: 'translateX(-3px)',
            'clip-path': 'inset(14% 0 47% 0)',
          },
          '75%': {
            opacity: '0.9',
            transform: 'translateX(1px)',
            'clip-path': 'inset(77% 0 11% 0)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),

    // Custom Trauma Encoding plugin
    plugin(function ({ addUtilities, theme, e }) {
      const traumaUtilities = {};
      const traumaLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      // Generate trauma-responsive text utilities
      traumaLevels.forEach((level) => {
        traumaUtilities[`.trauma-text-${level}`] = {
          position: 'relative',
          display: 'inline-block',
          color: level >= 8 ? theme('colors.trauma.500') : 'inherit',
          'text-shadow': level >= 5 ? `0 0 ${level}px rgba(215, 33, 184, 0.5)` : 'none',
        };

        if (level >= 7) {
          traumaUtilities[`.trauma-text-${level}::before`] = {
            content: 'attr(data-text)',
            position: 'absolute',
            left: '-2px',
            'text-shadow': 'none',
            top: '0',
            color: theme('colors.trauma.400'),
            overflow: 'hidden',
            clip: 'rect(0, 900px, 0, 0)',
            animation: 'noise-anim-1 3s infinite linear alternate-reverse',
          };

          traumaUtilities[`.trauma-text-${level}::after`] = {
            content: 'attr(data-text)',
            position: 'absolute',
            left: '2px',
            'text-shadow': 'none',
            top: '0',
            color: theme('colors.trauma.300'),
            overflow: 'hidden',
            clip: 'rect(0, 900px, 0, 0)',
            animation: 'noise-anim-2 2s infinite linear alternate-reverse',
          };
        }
      });

      // Generate phase-responsive container utilities
      const phaseTypes = ['cyber-lotus', 'alien-flora', 'rolling-virus', 'trauma-core'];

      phaseTypes.forEach((phase) => {
        const phaseName = phase.split('-')[0];
        traumaUtilities[`.phase-${phase}`] = {
          position: 'relative',
          'border-color': theme(`colors.${phaseName}.900`),
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            'pointer-events': 'none',
            'background-image': `linear-gradient(135deg, ${theme(
              `colors.${phaseName}.900`
            )}10, transparent)`,
            'mix-blend-mode': 'overlay',
            'z-index': '1',
          },
        };
      });

      // Text glitch effects
      traumaUtilities['.glitch-text'] = {
        position: 'relative',
        '&::before, &::after': {
          content: 'attr(data-text)',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: '0.8',
        },
        '&.active-glitch::before': {
          left: '-2px',
          'text-shadow': '-1px 0 #d721b8',
          background: 'transparent',
          animation: 'glitch-anim-1 0.4s linear infinite',
          'clip-path': 'inset(0 -5px 0 0)',
          'animation-delay': 'calc(-1 * 0.4s * 0.666)',
        },
        '&.active-glitch::after': {
          left: '2px',
          'text-shadow': '1px 0 #0ee7ff',
          background: 'transparent',
          animation: 'glitch-anim-2 0.35s linear infinite',
          'clip-path': 'inset(0 0 0 -5px)',
          'animation-delay': 'calc(-1 * 0.35s * 0.333)',
        },
      };

      addUtilities(traumaUtilities);
    }),
  ],
  variants: {
    extend: {
      opacity: ['group-hover'],
      backgroundColor: ['group-hover'],
      textColor: ['group-hover'],
      borderColor: ['group-hover'],
      margin: ['first', 'last'],
      padding: ['first', 'last'],
    },
  },
  // Enable CSS variable usage with arbitrary values
  safelist: [
    { pattern: /^(bg|text|border|shadow)-/ },
    { pattern: /^(profile|trauma-state)-/ },
    { pattern: /^(data-profile|data-trauma|data-coherence-score|data-quantum-state)-/ },
  ],
};
