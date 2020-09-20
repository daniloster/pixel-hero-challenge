const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const DEV_PORT = process.env.PORT
const env = {
  production: process.env.NODE_ENV === 'production',
  profile: process.env.NODE_ENV === 'profile',
}
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
  externals: {
    firebase: {
      root: 'firebase',
    },
  },
  resolve: {
    alias: {
      'pixel-hero': path.resolve(__dirname, '../../src'),
    },
    extensions: ['.mjs', '.js', '.ts'],
    mainFields: ['browser', 'module', 'main'],
  },
  resolveLoader: {
    alias: {
      worker: 'worker-plugin/loader?name=pwa-worker',
    },
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
    env.profile && new BundleAnalyzerPlugin(),
    new WorkerPlugin(),
    !env.profile &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './dev/assets',
            to: './',
          },
        ],
      }),
    // !env.profile &&
    //   !env.production &&
    //   new CompressionWebpackPlugin({
    //     filename: '[file]',
    //     algorithm: 'gzip',
    //     test: /\.jsx?$|\.css$|\.html$/,
    //     compressionOptions: {
    //       level: 9,
    //     },
    //     threshold: 10240,
    //     minRatio: 0.8,
    //   }),
    !env.profile &&
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

      .offline {
        padding: 2rem;
      }

      .offline-title {
        padding: 0 0 2rem 0;
      }

      .inline {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 4rem;
      }
    </style>
    <meta name="viewport" content="width=device-width">
    <link rel="manifest" href="./manifest.json">
    <link rel="apple-touch-icon" href="./images/logo.png" />
    <link rel="shortcut icon" type="image/png" href="./images/logo.png" />
    <meta name="description" content="Web Game to solve or create challenges and send to friends" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="background-color" content="#FFFFFF" />
    <meta name="theme-color" content="#000000" />
    <link href="https://fonts.googleapis.com/css?family=Maven+Pro|Yrsa|Press+Start+2P" rel="stylesheet">
    <!-- minify -->
    <link href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css" rel="stylesheet">
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <div id="root" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <noscript>
      <div class="offline">
        <div class="offline-title">
          <h1>Pixel Hero</h1>
          <sub>Challenge</sub>
        </div>

        <section class="nes-container with-title">
          <h3 class="title">Device Offline</h3>
          <section class="message-list">
            <section class="message inline">
              <i class="nes-bcrikko"></i>
              <!-- Balloon -->
              <div class="nes-balloon from-left">
                <p>
                  Unfortunately, your device does not support javascript.
                  Try updating the browser or installing chrome.
                </p>
              </div>
            </section>
          </section>
        </section>
      </div>
    </noscript>
    
    <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js"></script>

    <!-- If you enabled Analytics in your project, add the Firebase SDK for Analytics -->
    <script src="https://www.gstatic.com/firebasejs/7.19.1/firebase-analytics.js"></script>

    <!-- Add Firebase products that you want to use -->
    <script src="https://www.gstatic.com/firebasejs/7.19.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.19.1/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.19.1/firebase-firestore.js"></script>

    <script>
      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyDoH78xtW5v9LjWZaYnJpoFXg0YnXwf6lc",
        authDomain: "pixel-hero-challenge.firebaseapp.com",
        databaseURL: "https://pixel-hero-challenge.firebaseio.com",
        projectId: "pixel-hero-challenge",
        storageBucket: "pixel-hero-challenge.appspot.com",
        messagingSenderId: "769505330951",
        appId: "1:769505330951:web:32c8667c278225f6b827a2",
        measurementId: "G-QRHTGL8ZT9"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    </script>
  </body>
</html>
      `.trim(),
      }),
  ].filter((isValid) => !!isValid),
}
