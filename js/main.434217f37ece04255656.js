/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
 // Импорт SCSS в JS (Webpack обработает)

console.log('JS and SCSS are linked!');

// Пример современного JS, который будет транспилирован Babel
var greet = function greet(name) {
  return "Hello, ".concat(name, "!");
};
console.log(greet('Developer'));

// nefarious scroll activity
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('header'); // Получаем элемент хедер
  var scrollThreshold = 450; // Порог прокрутки в пикселях

  function checkScroll() {
    var scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > scrollThreshold) {
      if (!header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
      }
    } else {
      if (header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Проверка при загрузке страницы
});
/******/ })()
;
//# sourceMappingURL=main.434217f37ece04255656.js.map