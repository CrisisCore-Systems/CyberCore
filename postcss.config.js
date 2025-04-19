module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-custom-properties': {
      preserve: true, // Keep the original CSS variables
    },
    'postcss-nested': {}, // Support for nesting
  },
};
