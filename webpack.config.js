const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const MODE = process.env.WEBPACK_ENV;
const ENTRY = path.resolve(__dirname, 'assets', 'js', 'main.js');
const OUTPUT_DIR = path.join(__dirname, 'static');

const config = {
  entry: ["@babel/polyfill", ENTRY],
  devtool: 'inline-source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins() {
                  return [autoprefixer({ browsers: 'cover 99.5%' })];
                }
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ],
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js'
  },
  mode: MODE,
  plugins: [new MiniCssExtractPlugin({
    filename: 'styles.css'
  })],
}

module.exports = config;