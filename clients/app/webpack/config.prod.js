const webpack = require('webpack')
const paths = require('./paths')
const WorkboxPlugin = require('workbox-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  devtool: undefined,
  plugins: [
    // new WorkboxPlugin.GenerateSW({
    //   maximumFileSizeToCacheInBytes: 1024 * 1024 * 20,
    //   exclude: [/\.(html)$/i],
    // }),
    new webpack.EnvironmentPlugin({
      AACID: 'p2obj-aaaaa-aaaah-adkdq-cai', // 正式环境
      isProduction: process.env.NODE_ENV === 'production',
      LEDGER_CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
      LOGIN_TYPE: 'm3',
    }),
    new TerserPlugin({
      terserOptions: {
        compress: {
          // drop_console: false,
          drop_console: process.env.NODE_ENV === 'production',
        },
      },
    }),
  ],
}
