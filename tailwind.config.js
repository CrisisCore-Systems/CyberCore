/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './assets/**/*.{js,ts,jsx,tsx}',
    './templates/**/*.{liquid,json}',
    './sections/**/*.{liquid,json}',
    './snippets/**/*.liquid',
    './layout/**/*.liquid',
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
      },
    },
  },
  plugins: [],
  // Enable CSS variable usage with arbitrary values
  safelist: [
    { pattern: /^(bg|text|border|shadow)-/ },
    { pattern: /^(profile|trauma-state)-/ },
    { pattern: /^(data-profile|data-trauma|data-coherence-score|data-quantum-state)-/ },
  ],
};
