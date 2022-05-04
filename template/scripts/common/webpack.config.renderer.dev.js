 const { merge } = require('webpack-merge');

 const rendererBaseConfig = require('./webpack.config.renderer.base');

 module.exports = merge(rendererBaseConfig, {
   mode: 'development',
   devtool: 'inline-source-map',
 })
