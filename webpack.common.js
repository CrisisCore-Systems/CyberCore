const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Common configuration used in both dev and prod
const commonConfig = {
  entry: {
    'cyber-core': './assets/index.ts',
    'hologram-component': './assets/HologramComponent.js',
    'enhanced-cart': './assets/enhanced-cart.js',
    'neural-bus': './assets/neural-bus.js',
    'quantum-worker': './assets/quantum-worker.js',
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
      chunks: ['cyber-core', 'main-styles'],
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
