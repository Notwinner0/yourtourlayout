import './styles/main.scss'; // Импорт SCSS в JS (Webpack обработает)


console.log('JS and SCSS are linked!');

// Пример современного JS, который будет транспилирован Babel
const greet = (name) => `Hello, ${name}!`;
console.log(greet('Developer'));

// nefarious scroll activity
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header'); // Получаем элемент хедер
    const scrollThreshold = 450; // Порог прокрутки в пикселях

    function checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

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

document.querySelectorAll('.selector-button').forEach(button => {
  button.onclick = () => {
    document.querySelector('.selector-button.active')?.classList.remove('active');
    button.classList.add('active');
  };
});

const special = {
    consoleText: ((t = String) => console.log(t)), // print text
    hideScroll: (() => document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`body::-webkit-scrollbar{display:none}`}))) // hide scrollbar
}
window.special = special;