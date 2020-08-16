const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const DEV_PORT = process.env.PORT
const env = { production: false }
module.exports = {
  entry: './DEV/index.jsx',
  devtool: 'source-map',
  mode: env.production ? 'production' : 'development',
  node: {
    global: false,
    __dirname: false,
    __filename: true,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    'react-router-dom': 'ReactRouterDOM',
    'styled-components': 'styled',
  },
  resolve: {
    alias: {
      'pixel-hero': path.resolve(__dirname, '../../src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
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
    compress: true,
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
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: 'all',
        terserOptions: {
          ie8: false,
        },
      }),
    ],
  },
  plugins: [
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: 'DEV/assets', to: 'assets' },
    //   ]
    // }),
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
    <script crossorigin src="https://unpkg.com/react@16.13.1/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-is@16.13.1/umd/react-is.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-router/5.2.0/react-router.min.js" integrity="sha512-sWGrnSIvNDdGRsqnFIm5q1uHjPt5912wNVBK9vChpbHPReP96giWBGeztcd/rva+n82nQLTJ1SFbZqLHbCqMiw==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/5.2.0/react-router-dom.min.js" integrity="sha512-NG4Cm3Ubs7d/nPyzrTFM53RP8tPjQhRT0hea48yJ/qEXsuhq7wGbjX68A5gBiW6BoCQbqE3/M+UOj2lLXPauhw==" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/styled-components@5.1.1/dist/styled-components.min.js"></script>
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
