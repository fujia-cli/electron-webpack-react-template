const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const rendererBaseConfig = require('../common/webpack.config.renderer.base');
const webpack = require('webpack');

module.exports = merge(rendererBaseConfig, {
  mode: 'production',
  devtool: false,

  module: {
    rules: [
      {
        test: /\.s?(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /\.module\.s?(c|a)ss$/,
      },
    ]
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        // 打包公共模块
        commons: {
          // initial表示提取入口文件的公共部分
          chunks: 'initial',
          // 表示提取公共部分最少的文件数
          minChunks: 2,
          // 表示提取公共部分最小的大小
          minSize: 0,
          // 提取出来的文件命名
          name: 'commons',
        },
      },
    },
  },

  plugins: [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
    }),
  ],
});
