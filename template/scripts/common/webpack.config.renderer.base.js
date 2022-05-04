/**
 * Electron render process
 */
const { resolve, getRendererObj } = require('./utils');
const { releaseBundledPath, assetsIconsPath } = require('./webpack.paths')

const rendererObj = getRendererObj();

module.exports = {
  target: ['web', 'electron-renderer'],
  entry: rendererObj.entry,
  output: {
    filename: '[name].bundle.js',
    path: releaseBundledPath,
    publicPath: '/',
    library: {
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@store': resolve('/src/renderer/store'),
      '@pages': resolve('/src/renderer/pages'),
      '@components': resolve('/src/renderer/components'),
      '@utils': resolve('/src/renderer/utils'),
      '@assets': resolve('/src/renderer/assets'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {},
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: 'fill',
                  },
                },
              ],
            },
          },
        ],
        include: [assetsIconsPath]
      },
      // {
      //   test: /\.(jpg|png|jpeg|gif|svg)$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 2048,
      //         name: '[name]_[hash:5].[ext]',
      //         outputPath: 'images/',
      //       },
      //     },
      //   ],
      //   exclude: [assetsIconsPath]
      // },
       // Fonts
       {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        exclude: [assetsIconsPath]
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              // NOTE: whether to enable css module
              // modules: {
              //   localIdentName: '[local]__[hash:base64:5]',
              // },
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /\.module\.s?(c|a)ss$/,
      },
    ],
  },
  plugins: [
    ...rendererObj.plugins
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
};
