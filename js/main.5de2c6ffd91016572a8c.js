/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
 // Импорт SCSS в JS (Webpack обработает)

var appDiv = document.getElementById('app');
appDiv.innerHTML = '<p>JavaScript is working!</p>';
console.log('JS and SCSS are linked!');

// Пример современного JS, который будет транспилирован Babel
var greet = function greet(name) {
  return "Hello, ".concat(name, "!");
};
console.log(greet('Developer'));
/******/ })()
;
//# sourceMappingURL=main.5de2c6ffd91016572a8c.js.map