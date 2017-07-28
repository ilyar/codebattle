var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require('path');

module.exports = {
  entry: ['bootstrap-loader', './web/static/js/app.js'],
  output: {
    path: path.join(__dirname, 'priv', 'static', 'js'),
    filename: 'app.js',
    publicPath: 'priv/static'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader'
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 40000 }
          },
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('../css/app.css'),
    new CopyWebpackPlugin([{ from: path.join(__dirname, 'web', 'static', 'assets') }])
  ],
  resolve: {
    modules: [ 'node_modules', path.join(__dirname, 'web', 'static', 'js') ],
    extensions: ['.js', '.jsx']
  }
};
