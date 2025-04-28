const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const autoprefixer = require('autoprefixer');
const PnpWebpackPlugin = require('pnp-webpack-plugin'); // Импорт плагина PnP

// Укажите здесь точное имя вашего репозитория на GitHub
const REPOSITORY_NAME = 'yourtourlayout'; // !!! ЗАМЕНИТЕ НА ИМЯ ВАШЕГО РЕПОЗИТОРИЯ !!!

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      // !!! ИСПРАВЛЕНО: Динамический publicPath для GitHub Pages !!!
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
      historyApiFallback: true, // Полезно для одностраничных приложений
    },

    resolve: {
      plugins: [
        PnpWebpackPlugin, // Добавляем плагин PnP в список плагинов резолвера
      ],
      // Добавьте разрешение для расширений файлов, чтобы не писать их в import/require
      extensions: ['.js', '.json', '.css', '.scss'],
    },

    module: {
      rules: [
        // Правило для JavaScript
        {
          test: /\.js$/,
          // При использовании PnP, исключать node_modules обычно не требуется,
          // но если есть проблемы, можно попробовать раскомментировать следующую строку:
          // exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]], // Добавлено useBuiltIns для полифиллов
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
            // Убедитесь, что путь здесь не начинается со слэша, т.к. publicPath добавит его
            filename: isProduction ? 'assets/[hash][ext][query]' : 'assets/[name][ext][query]'
          }
        },
        // Правило для HTML
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                // Обрабатывать ссылки на изображения и т.д. в HTML
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
                      // Учитывать только теги link с rel="stylesheet"
                      filter: (tag, attribute, attributes) => {
                        return attributes.rel === 'stylesheet';
                      },
                    },
                    // Добавьте другие теги/атрибуты, если необходимо
                  ],
                },
                minimize: isProduction, // Минифицировать HTML в production
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html', // Выходное имя файла в папке dist
        minify: isProduction, // Минифицировать HTML в production
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].bundle.css',
      }),
      // CleanWebpackPlugin уже добавлен и настроен в output.clean: true
      // new CleanWebpackPlugin(),
    ],

    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        // Добавьте TerserPlugin для минификации JS в production, если он не идет по умолчанию
        // new TerserPlugin({
        //   parallel: true,
        // }),
      ],
      splitChunks: {
         chunks: 'all', // Разделение кода для оптимизации загрузки
      },
    },

    // >>> Добавьте или обновите секцию resolveLoader
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module), // Добавляем плагин PnP для резолва лоадеров
      ],
    },
  };
};