const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

const outputDirectory = 'dist'

const DOMAIN_ADDRESS = process.env.DOMAIN_ADDRESS || '"/api"'
/* 'FRONTEND_ADDRESS' is used in '/src/helpers/history.js' as 'basename' for creating custom browser history */
const FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS || '"/"'

module.exports = {
  mode: 'development',
  entry: {
    app: ['@babel/polyfill', './src/index.js']
  },
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: 'js/[name].js',
    // publicPath: '/innometrics/'
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(png|jpe?g)$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'media/[name].[ext]',
            },
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                query: {
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]'
                }
              }
            ]
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(jsx?|html)$/],
            options: {
              name: 'media/[name].[ext]',
            },
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      title: 'Innometrics',
      hash: true,
      template: 'public/index.html'
    }),
    new webpack.DefinePlugin({
     DOMAIN_ADDRESS: DOMAIN_ADDRESS,
     FRONTEND_ADDRESS: FRONTEND_ADDRESS
    })
  ]
}
