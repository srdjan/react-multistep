const path = require('path');

module.exports = {
  entry: [
    './index.js'
  ],
  resolve: {
    modules: ['./node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};