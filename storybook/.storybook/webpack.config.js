const path = require('path');

module.exports = {
  mode: 'development',
  resolve: {
    alias: {
      assets: path.resolve(__dirname, '../src/assets')
    },
    extensions: ['.js', '.jsx', '.css', '.scss', '.png', '.jpg', '.gif', '.jpeg', '.svg']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          noquotes: true
        }
      },
      {
        test: /\.(woff)$/,
        loader: ['file-loader'],
      }
    ]
  }
}
