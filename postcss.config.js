module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'color-function': true,
        'custom-media-queries': true,
      },
    }),
    require('postcss-custom-properties')({
      preserve: true,
    }),
    require('postcss-import'),
    require('postcss-logical'),
    require('postcss-color-mix-function'),
    require('postcss-math'),
  ],
  // Production mode optimization (used in webpack.prod.js)
  ...(process.env.NODE_ENV === 'production' && {
    map: false,
    plugins: [
      require('autoprefixer'),
      require('postcss-preset-env')({
        stage: 3,
        features: {
          'nesting-rules': true,
          'custom-properties': true,
          'color-function': true,
        },
      }),
      require('postcss-custom-properties')({
        preserve: false,
      }),
      require('postcss-import'),
      require('postcss-logical'),
      require('postcss-color-mix-function'),
      require('postcss-math'),
      // Add production-only plugins
      require('cssnano')({
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            cssDeclarationSorter: true,
            colormin: true,
            reduceIdents: true,
            mergeRules: true,
            mergeLonghand: true,
          },
        ],
      }),
    ],
  }),
};
