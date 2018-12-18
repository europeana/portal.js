module.exports = {
  mode: 'development',
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
      }
    ]
  }
}
