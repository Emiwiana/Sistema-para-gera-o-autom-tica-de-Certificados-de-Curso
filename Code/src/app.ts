import express from 'express';
import path from 'path';
const routes = require('./routes');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/generated', express.static(path.join(__dirname, '../output')));
console.log(path.join(__dirname, '../public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});