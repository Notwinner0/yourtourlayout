const { src, dest, watch, series, parallel } = require('gulp');
const path = require('path');
const { exec } = require('child_process'); // Для запуска команд Yarn/npm

// Задача для очистки папки сборки (хотя Webpack теперь может делать это сам)
// function cleanDist(cb) {
//   // Используйте подходящий плагин для очистки, если нужно вне Webpack
//   cb();
// }

// Задача для копирования статических файлов, которые не обрабатываются Webpack (опционально)
function copyStatic() {
  return src('src/static/**/*') // Копируем все из src/static
    .pipe(dest('dist/static')); // В dist/static
}

// Задача для запуска сборки Webpack в режиме разработки
function webpackDev(cb) {
  // Запускаем скрипт Yarn "start" из package.json
  exec('yarn start', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
}

// Задача для запуска сборки Webpack в режиме production
function webpackBuild(cb) {
   // Запускаем скрипт Yarn "build" из package.json
  exec('yarn build', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
}

// Задача для наблюдения за изменениями статических файлов (если они есть)
function watchStatic() {
  watch('src/static/**/*', copyStatic);
}

// Главная задача для разработки: запуск сервера Webpack и наблюдение за статикой
exports.dev = parallel(webpackDev, watchStatic);

// Главная задача для production сборки: копирование статики и сборка Webpack
exports.build = series(copyStatic, webpackBuild);

// Задача по умолчанию при запуске "gulp"
exports.default = exports.dev;