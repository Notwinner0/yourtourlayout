const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const autoprefixer = require('autoprefixer');
// >>> Добавьте эту строку для импорта плагина PnP
const PnpWebpackPlugin = require('pnp-webpack-plugin');


module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-source-map',

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 8080,
      open: true,
      hot: true,
      historyApiFallback: true,
    },

    // >>> Добавьте или обновите секцию resolve
    resolve: {
      plugins: [
        PnpWebpackPlugin, // Добавляем плагин PnP в список плагинов резолвера
      ],
    },


    module: {
      rules: [
        // Правило для JavaScript
        {
          test: /\.js$/,
          exclude: /node_modules/, // При использовании PnP, исключать node_modules обычно не требуется
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        // Правило для SCSS и CSS
        {
          test: /\.(scss|css)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    autoprefixer(),
                  ],
                },
              },
            },
            'sass-loader',
          ],
        },
        // Правило для изображений и шрифтов
        {
          test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext][query]'
          }
        },
        // Правило для HTML
        {
          test: /\.html$/,
          use: ['html-loader'],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].bundle.css',
      }),
    ],

    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
         chunks: 'all',
      },
    },
  };
};