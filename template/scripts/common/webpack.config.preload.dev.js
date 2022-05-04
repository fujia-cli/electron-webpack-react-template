const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('../common/webpack.config.base');

const { srcMainPath, releaseBundledPath } = require('./webpack.paths')

module.exports = merge(baseConfig, {
  target: 'electron-preload',
  devtool: 'inline-source-map',
  mode: 'development',
  entry: path.join(srcMainPath, 'preload.ts'),
  output: {
    path: releaseBundledPath,
    filename: 'preload.js'
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
    }),
     /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
      }),

      new webpack.LoaderOptionsPlugin({
        debug: true,
      }),
  ],
  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
   node: {
    __dirname: false,
    __filename: false,
  },

  watch: true,
});
