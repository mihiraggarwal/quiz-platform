const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, '/views/'));

app.engine('hbs', expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts'
}))

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/static'));

app.get('/play', (req, res) => {
    res.render('play');
});

app.listen(3000, console.log('Started'));