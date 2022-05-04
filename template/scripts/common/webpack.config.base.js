const nodeExternals = require('webpack-node-externals');

module.exports = {
  externals: [nodeExternals()],
  devtool: 'source-map',
  stats: 'errors-only',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
