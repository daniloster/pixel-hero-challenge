const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const DEV_PORT = process.env.PORT
const env = { production: process.env.NODE_ENV === 'production' }
console.log({ env })
module.exports = {
  entry: './dev/index.js',
  target: 'web',
  devtool: 'source-map',
  node: {
    global: false,
    __dirname: false,
    __filename: true,
  },
  resolve: {
    alias: {
      'pixel-hero': path.resolve(__dirname, '../../src'),
    },
    extensions: ['.mjs', '.js', '.ts'],
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|((?!d\.)ts)|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        /**
         * Any other file than the (tsx|ts|jsx|js) will be taken care by url-loader
         * falling back to file-loader
         */
        // test: /\.(png|jpg|jpeg|gif)$/i,
        // test: /^(.(?!(html|js|jsx|ts|tsx)))+$/i,
        test: /^(.(?!(html|js|jsx|ts|tsx)))+$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: true,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '../../dist/'),
    historyApiFallback: true,
    compress: !env.production,
    hot: true,
    port: DEV_PORT,
    publicPath: '/',
  },
  output: {
    path: path.resolve(__dirname, '../../dist/'),
    filename: 'index.js',
    publicPath: '/',
  },
  optimization: {
    minimize: env.production,
    minimizer: [
      env.production &&
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          extractComments: 'all',
          terserOptions: {
            ie8: false,
          },
        }),
    ].filter((isValid) => !!isValid),
  },
  plugins: [
    new WorkerPlugin(),
    env.production &&
      new CompressionWebpackPlugin({
        filename: '[file]',
        algorithm: 'gzip',
        test: /\.jsx?$|\.css$|\.html$/,
        compressionOptions: {
          level: 9,
        },
        threshold: 10240,
        minRatio: 0.8,
      }),
    new HtmlWebpackPlugin({
      title: 'Pixel Hero',
      templateContent: `
<html>
  <head>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="root" />
  </body>
</html>
      `.trim(),
    }),
  ].filter((isValid) => !!isValid),
}
