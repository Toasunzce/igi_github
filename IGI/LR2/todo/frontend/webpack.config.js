const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.js', publicPath: '/' },
  module: { rules: [{ test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' }] },
  resolve: { extensions: ['.js', '.jsx'] },
  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],
  devServer: {
    port: 3000,
    proxy: { '/api': 'http://backend:5000' },
  },
};
