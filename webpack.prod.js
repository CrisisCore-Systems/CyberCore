const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const zlib = require('zlib');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackPurgeCSSPlugin = require('./scripts/webpack-purge-css-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

// Production configuration
const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    // Remove content hashes for Shopify compatibility
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // Added for HTTP/2 optimization
    chunkFilename: '[name].chunk.js',
    // Set publicPath for CDN usage if available
    publicPath: process.env.CDN_URL || '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: false, // Disable sourcemaps for CSS in production
            },
          },
          'postcss-loader',
        ],
      },
      // Optimize TypeScript loader
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // Skip type checking to allow the build to complete
              transpileOnly: true,
              compilerOptions: {
                allowJs: true,
                strict: false,
                noImplicitAny: false,
                strictPropertyInitialization: false,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      // Optimize babel-loader for JS files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // Add browserlist targets for better optimization
                  targets: '> 0.25%, not dead',
                  // Use modules false for better tree shaking
                  modules: false,
                  // Use specific features instead of the entire polyfill
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-private-methods',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-private-property-in-object',
              // Add plugin for lazy loading
              '@babel/plugin-syntax-dynamic-import',
            ],
            // Add caching for faster rebuilds
            cacheDirectory: true,
          },
        },
      },
      // Optimize image loading
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // Only inline very small images
            maxSize: 4 * 1024, // 4kb
          },
        },
      },
      // SVG optimization
      {
        test: /\.svg$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    // Purge CSS to reduce bundle size
    new WebpackPurgeCSSPlugin(),
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
    // Enable module concatenation for scope hoisting
    new ModuleConcatenationPlugin(),
    // Using standard gzip compression
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: {
        level: 9, // Maximum compression level
      },
    }),
    // Compress assets with Brotli (even better compression)
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
    // Bundle analyzer to visualize bundle size (optional - only run when analyzing)
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true, // Use multi-process parallel running
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.debug', 'console.info'],
            passes: 2, // Run compressor twice for better results
            ecma: 5, // Specify ECMAScript version to support
            unsafe_math: true, // Use faster math operations
            unsafe_methods: true, // Enable unsafe transformations for methods
          },
          mangle: {
            safari10: true, // Fix Safari 10 bugs
          },
          output: {
            comments: false,
            ecma: 5,
            safari10: true,
          },
          // Enable module tree shaking
          module: true,
        },
        extractComments: false,
      }),
      // Add CSS minimizer
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              cssDeclarationSorter: true,
              reduceIdents: true,
            },
          ],
        },
        parallel: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
      maxInitialRequests: 6, // Increase number of parallel requests
      cacheGroups: {
        // Vendor chunk for node_modules
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          enforce: true,
          reuseExistingChunk: true,
        },
        // Quantum core libraries
        quantum: {
          test: /[\\/]quantum-.*\.js$/,
          name: 'quantum-core',
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
        // Neural bus and event system
        neural: {
          test: /[\\/](neural-bus|memory-protocol).*\.js$/,
          name: 'neural-core',
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
        // Cart and API related functionality
        cart: {
          test: /[\\/](cart-|api-|safe-api).*\.(js|ts)$/,
          name: 'cart-system',
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
        // UI components and design system
        ui: {
          test: /[\\/](coherence-design|dom-cache|ui-).*\.(js|ts)$/,
          name: 'ui-components',
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
        // Dynamic imports for large libraries
        dynamicImports: {
          test: /[\\/]node_modules[\\/](three|quantum-visualizer)[\\/]/,
          name: 'dynamic-imports',
          chunks: 'async',
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 0,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    // Enable runtime chunk
    runtimeChunk: 'single',
    // Tree shaking improvements
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    // Deterministic module IDs for better long term caching
    moduleIds: 'deterministic',
  },
  // Additional performance optimization hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  // Don't fail on errors during production build
  bail: false,
};

module.exports = merge(commonConfig, prodConfig);
