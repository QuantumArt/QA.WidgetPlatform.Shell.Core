const path = require('path');

/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
  entry: path.resolve(__dirname, '../src/index'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  externals: ['react', 'react-dom'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
};

module.exports = webpackConfig;
