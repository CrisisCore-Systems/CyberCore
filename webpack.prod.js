const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// Production configuration
const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    // Remove content hashes for Shopify compatibility
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Remove content hashes for Shopify compatibility
      filename: 'css/[name].css',
    }),
    // Copy necessary theme files to dist
    new CopyWebpackPlugin({
      patterns: [
        { from: 'layout', to: 'layout' },
        { from: 'templates', to: 'templates' },
        { from: 'snippets', to: 'snippets' },
        { from: 'sections', to: 'sections' },
        { from: 'config', to: 'config' },
        { from: 'locales', to: 'locales' },
        // Copy essential assets that don't go through webpack
        {
          from: 'assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/*.ts', '**/*.js', '**/*.scss', '**/*.css'],
          },
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
        extractComments: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = merge(commonConfig, prodConfig);
