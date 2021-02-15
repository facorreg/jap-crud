/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const shared = require('./webpack.shared');

// eslint-disable-next-line no-new
new webpack.ContextReplacementPlugin(/.*/);

const config = {
  entry: './server.js',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js$/,
      },
      {
        resolve: {
          fullySpecified: false,
        },
        test: /\.m?js/,
      },
    ],
  },
  ...shared,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new NodemonPlugin()],
  target: 'node',
};

module.exports = config;
