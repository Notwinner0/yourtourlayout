const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const autoprefixer = require('autoprefixer');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

// Укажите здесь точное имя вашего репозитория на GitHub
const REPOSITORY_NAME = 'yourtourlayout'; // !!! ЗАМЕНИТЕ НА ИМЯ ВАШЕГО РЕПОЗИТОРИЯ !!!

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: isProduction ? `/${REPOSITORY_NAME}/` : '/',
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
      historyApiFallback: {
        rewrites: [
          { from: /^\/agreement$/, to: '/agreement.html' },
          { from: /./, to: '/index.html' },
        ],
      },
    },

    resolve: {
      plugins: [
        PnpWebpackPlugin,
      ],
      extensions: ['.js', '.json', '.css', '.scss'],
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [
            /node_modules/,
            /\.yarn[\\\/].*?[\\\/]virtual[\\\/]/
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]
              ],
            },
          },
        },
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
        {
          test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            // Убедитесь, что favicon.svg также попадает в assets/
            filename: isProduction ? 'assets/[hash][ext][query]' : 'assets/[name][ext][query]'
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: {
                  list: [
                    {
                      tag: 'img',
                      attribute: 'src',
                      type: 'src',
                    },
                    {
                      tag: 'link',
                      attribute: 'href',
                      type: 'src',
                      filter: (tag, attribute, attributes) => {
                        return attributes.rel === 'stylesheet';
                      },
                    },
                  ],
                },
                minimize: isProduction ? {
                  removeAttributeQuotes: false,
                  collapseWhitespace: true,
                  removeComments: true,
                } : false,
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        minify: isProduction ? {
          removeAttributeQuotes: false,
          collapseWhitespace: true,
          removeComments: true,
        } : false,
        // ДОБАВЛЕНО: Указываем путь к favicon
        favicon: './src/assets/images/favicon.svg',
      }),
      new HtmlWebpackPlugin({
        template: './src/agreement.html',
        filename: 'agreement.html',
        minify: isProduction,
        // ДОБАВЛЕНО: Указываем путь к favicon
        favicon: './src/assets/images/favicon.svg',
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

    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
  };
};