module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: ['>0.5%', 'not dead', 'not ie 11', 'not op_mini all'],
        },
        modules: 'auto',
        useBuiltIns: 'usage',
        corejs: { version: '3.30', proposals: true },
      },
    ],
  ],
  plugins: [
    // Class features support
    ['@babel/plugin-proposal-private-methods', { loose: false }],
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: false }],

    // Additional transforms
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',

    // Optimization for production
    process.env.NODE_ENV === 'production' && [
      'transform-remove-console',
      { exclude: ['error', 'warn', 'info'] },
    ],
  ].filter(Boolean),
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
    development: {
      plugins: ['babel-plugin-add-module-exports'],
    },
    production: {
      presets: [
        [
          'minify',
          {
            builtIns: false,
            evaluate: true,
            mangle: true,
          },
        ],
      ],
    },
  },
};
