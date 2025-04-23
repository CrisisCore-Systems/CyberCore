const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Common configuration used in both dev and prod
const commonConfig = {
  entry: {
    // Core bundle - essential functionality
    'core-bundle': [
      './assets/neural-bus.js',
      './assets/performance-manager.js',
      './assets/coherence-persistence.js'
    ],
    
    // WebGL bundle - all visualization effects
    'webgl-bundle': [
      './assets/quantum-webgl.js',
      './assets/qear-webgl-bridge.js',
      './assets/hologram-renderer.js',
      './assets/glitch-engine.js'
    ],
    
    // Cart bundle - all cart-related functionality
    'cart-bundle': [
      './assets/cart-system.js',
      './assets/enhanced-cart.js'
    ],
    
    // Keep some files separate due to specific loading requirements
    'ritual-engine': './assets/ritual-engine.js',
    'voidbloom-store': './assets/voidbloom-store.js',
    
    // Styles
    'main-styles': './assets/main.css',
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-private-methods',
              '@babel/plugin-proposal-private-property-in-object',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'assets'),
      '@core': path.resolve(__dirname, 'Core'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: '[name]',
      type: 'umd',
      export: 'default',
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false, // Keep console logs for debugging
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Extract common dependencies into a separate file
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 10,
        },
        // Create a vendor bundle for third-party code
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './templates/demo.html',
      filename: 'index.html',
      chunks: ['core-bundle', 'webgl-bundle', 'main-styles'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'templates/*.liquid', to: 'templates/[name][ext]' },
        { from: 'sections/*.liquid', to: 'sections/[name][ext]' },
        { from: 'snippets/*.liquid', to: 'snippets/[name][ext]' },
      ],
    }),
  ],
};

module.exports = commonConfig;
