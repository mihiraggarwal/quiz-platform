const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

const PORT = process.env.PORT || 3000;

const app = express();
require('dotenv').config()

const creds = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
}

firebase.initializeApp(creds);

let db = firebase.firestore();

app.set('views', path.join(__dirname, '/views/'));

app.engine('hbs', expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts'
}))

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/static'));

app.get('/play', (req, res) => {
    db.collection('questions').doc('q1').get()
    .then((doc) => {
        if (doc.exists) {
            console.log(doc.data())
            res.render('play', {data: {data: doc.data()}});
        }
        else { console.log('no data') }
    }).catch((err) => {
        console.error(err);
    })
});

app.post('/play', (req, res) => {
    res.send('Posted')
})

app.listen(PORT, console.log('Started'));
