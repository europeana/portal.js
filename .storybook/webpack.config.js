const path = require('path');

module.exports = {
  mode: 'development',
  resolve: {
    alias: {
      assets: path.resolve(__dirname, '../assets')
    },
    extensions: ['.js', '.jsx', '.css', '.png', '.jpg', '.gif', '.jpeg', '.svg'],
  },
  module: {
    rules: [

      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },

      // this will apply to both plain `.scss` files
      // AND `<style lang="scss">` blocks in `.vue` files

      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },

      {
        test: /\.svg$/,
        loader: 'svg-url-loader', 
        options: {
          noquotes: true
        }
      }

    ]
  }
}
