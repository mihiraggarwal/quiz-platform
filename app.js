const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const play = require('./routes/play')

const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, '/views/'));

app.engine('hbs', expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts'
}))

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/static'));

app.use('/play', play);

app.listen(PORT, console.log('Started'));
