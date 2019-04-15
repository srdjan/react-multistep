module.exports = {
  entry: './index.js',
  output: {
    library: 'react-multistep',
    libraryTarget: 'umd',
    filename: 'lib.js',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        external: ['react', 'react-dom'],
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/react']
        }
      }
    ]
  }
}
