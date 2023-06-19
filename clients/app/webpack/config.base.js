const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const Webpackbar = require('webpackbar')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const paths = require('./paths')
console.log(paths.appSrc)

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: paths.appIndexJs,
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: paths.appBuild,
    publicPath: '/',
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    splitChunks: {
      chunks: 'async',
      // maxSize: 1024*1024,
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        lottie: {
          test: /[\\/]lottiePath[\\/]/,
          name: 'lottie',
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  stats: {
    errorDetails: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    // aliasFields: ['browser'],
    alias: {
      srcPath: paths.appSrc,
      'bn.js': path.resolve(paths.appPath, 'node_modules/bn.js'),
      lodash: path.resolve(paths.appPath, 'node_modules/lodash'),
    },
    fallback: {
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      stream: require.resolve('stream-browserify/'),
      // util: require.resolve('util/'),
      os: require.resolve('os-browserify/browser'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      crypto: require.resolve('crypto-browserify'),
      borc: require.resolve('borc'),
      zlib: false,
    },
  },
  devServer: {
    port: 3008,
    client: {
      logging: 'error',
      progress: true,
    },
    hot: false,
    liveReload: true,
    // watchFiles: [paths.srcPath],
    host: '0.0.0.0',
    historyApiFallback: true,
    proxy: {
      '/api': `http://127.0.0.1:8080`,
      // '/api': `http://18.163.118.92:8080`,
      // '/api': 'http://3.82.219.86:8881',
      // "/api": "http://122.248.226.210:8000",
      '/authorize': 'http://127.0.0.1:3001',
    },
  },
  // Depending in the language or framework you are using for
  // front-end development, add module loaders to the default
  // webpack configuration. For example, if you are using React
  // modules and CSS as described in the "Adding a stylesheet"
  // tutorial, uncomment the following lines:
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015',
        },
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(svg|otf|ttf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(less|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // strictMath: true,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new Webpackbar(),
    new CopyPlugin({
      patterns: [
        {
          from: paths.appPublic,
          to: paths.appBuild,
        },
      ],
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve('buffer/'), 'Buffer'],
      process: require.resolve('process/browser'),
    }),

    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new MiniCssExtractPlugin({ filename: '[name].[chunkhash].css' }),
    new HtmlWebpackPlugin({
      // Also generate a test.html
      // filename: 'index.html',
      template: paths.appHtml,
    }),
  ],
}
