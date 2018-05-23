module.exports = {
  entry: [
    './example/index.js'
  ],
  output: {
    path: __dirname + '/example',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};