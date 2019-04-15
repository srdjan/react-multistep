const path = require('path');

module.exports = {
  entry: [
    './index.js'
  ],
  resolve: {
    alias: {
      React: path.resolve(__dirname, './node_modules/react/'),
      ReactDOM: path.resolve(__dirname, './node_modules/react-dom/')
    }
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