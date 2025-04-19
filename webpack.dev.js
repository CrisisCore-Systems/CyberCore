const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

// Development configuration
const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: './dist',
    },
    hot: true,
    port: 9000,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
  },
  optimization: {
    runtimeChunk: 'single',
  },
};

module.exports = merge(commonConfig, devConfig);
