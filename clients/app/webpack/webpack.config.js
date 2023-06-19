const path = require('path')
const { merge } = require('webpack-merge')

const baseConfig = require('./config.base.js')
const config =
  process.env.NODE_ENV === 'development'
    ? require('./config.dev')
    : require('./config.prod')
module.exports = merge(baseConfig, config)
