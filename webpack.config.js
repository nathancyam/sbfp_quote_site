const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    path.resolve(__dirname, 'src', 'frontend', 'main')
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      vue: 'vue/dist/vue.common.js'
    }
  },
  output: {
    path: `${__dirname}/public/js/`,
    filename: `build.game.js`
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.(js)$/,
        loaders: ['babel?cacheDirectory'],
        include: [
          path.resolve(__dirname, 'src', 'frontend')
        ]
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
};
