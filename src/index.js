import './styles/main.scss'; // Импорт SCSS в JS (Webpack обработает)

const appDiv = document.getElementById('app');
appDiv.innerHTML = '<p>JavaScript is working!</p>';

console.log('JS and SCSS are linked!');

// Пример современного JS, который будет транспилирован Babel
const greet = (name) => `Hello, ${name}!`;
console.log(greet('Developer'));