/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const config = {
  resolve: {
    alias: {
      '@COMMON': path.resolve(__dirname, 'src/COMMON'),
      '@CREATE': path.resolve(__dirname, 'src/CREATE'),
      '@DELETE': path.resolve(__dirname, 'src/DELETE'),
      '@GET': path.resolve(__dirname, 'src/GET'),
      '@UPDATE': path.resolve(__dirname, 'src/UPDATE'),
      '@es/schemas': path.resolve(__dirname, 'src/elastic/schemas'),
      '@es': path.resolve(__dirname, 'src/elastic/index.js'),
      '@models': path.resolve(__dirname, 'src/mongo/models'),
      '@mongo': path.resolve(__dirname, 'src/mongo'),
      '@utils': path.resolve(__dirname, 'src/utils/index.js'),
    },
    extensions: ['.mjs', '.js'],
  },
};

module.exports = config;
