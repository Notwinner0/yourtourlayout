import './styles/main.scss'; // Импорт SCSS в JS (Webpack обработает)


console.log('JS and SCSS are linked!');

// Пример современного JS, который будет транспилирован Babel
const greet = (name) => `Hello, ${name}!`;
console.log(greet('Developer'));