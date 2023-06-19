const webpack = require('webpack')
const paths = require('./paths')
const path = require('path')

module.exports = {
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({
      AACID: 'p2obj-aaaaa-aaaah-adkdq-cai', // 正式环境
      isProduction: process.env.NODE_ENV === 'production',
      LEDGER_CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
      LOGIN_TYPE: 'm3',
    }),
  ],
}
