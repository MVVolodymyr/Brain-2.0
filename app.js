var express = require ('express');
var path = require('path'); // 👈 Додано path для коректної роботи зі шляхами
var indexRouter = require("./routes/index.js");

var app = express();

// Налаштування шаблонізатора
app.set('views', path.join(__dirname, 'views')); // 👈 Рекомендується використовувати path.join
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// 💥 ФІКС: Обслуговуємо теку node_modules, щоб браузер міг знайти AWS Amplify
// Запит до /node_modules/... буде обслуговуватися з локальної теки node_modules/
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules'))); 

// Обслуговуємо статичні файли (наприклад, style.css)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Express running on http://localhost:${PORT}`);
});
