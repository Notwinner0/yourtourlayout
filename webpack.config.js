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
    entry: './src/index.js', // Главная точка входа, предположим, что agreement.html использует те же скрипты/стили
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
      port: 8080, // Изменено на 8090
      open: true,
      hot: true,
      // Настройка historyApiFallback для обработки маршрутов без расширения .html
      historyApiFallback: {
        rewrites: [
          // Перенаправляем /agreement на agreement.html
          { from: /^\/agreement$/, to: '/agreement.html' },
          // Оставляем стандартное перенаправление для всех остальных путей (если это SPA)
          // Если это многостраничное приложение без SPA роутинга, возможно, historyApiFallback: true
          // достаточно, но явное указание реврайтов для конкретных файлов надежнее.
          // Если вам нужен обычный доступ к файлам (например, /about.html), то этот рерайт не нужен
          // и можно просто обращаться по полному имени файла.
          // Если вы используете SPA роутинг для index.html, оставьте этот рерайт:
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
                // Правильная настройка minimize
                minimize: isProduction ? {
                  // Указываем `removeAttributeQuotes: false` для предотвращения удаления кавычек
                  removeAttributeQuotes: false,
                  // Также можно добавить другие полезные опции, если нужны
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
      // Плагин для index.html
      new HtmlWebpackPlugin({
        template: './src/index.html', // Убедитесь, что этот файл существует
        filename: 'index.html',
        minify: isProduction ? {
          removeAttributeQuotes: false,
          collapseWhitespace: true,
          removeComments: true,
        } : false,
        
        // chunks: ['main'], // Укажите чанки, если у вас несколько точек входа
      }),
      // Плагин для agreement.html
      new HtmlWebpackPlugin({
        template: './src/agreement.html', // *** Создайте этот файл ***
        filename: 'agreement.html',     // Имя выходного файла в директории dist
        minify: isProduction,
        // chunks: ['main'], // Укажите чанки, если agreement.html использует тот же JS что и index.html
                               // Если agreement.html полностью статичен, используйте chunks: []
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].bundle.css',
      }),
      // CleanWebpackPlugin не обязателен в devServer, но полезен для сборки продакшена
      // new CleanWebpackPlugin(), // Обычно добавляют его для production сборки
    ],

    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        // Добавьте TerserPlugin сюда для минимизации JS в production, если он не включен по умолчанию
        // new TerserPlugin(),
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