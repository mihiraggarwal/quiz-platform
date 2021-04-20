const express = require('express');
const bodyParser = require('body-parser');
const json = require('json');
const urlencoded = require('url');
const router = express.Router();
const fbApp = require('../models/firebase');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

db = fbApp.firestore();
let docId = '';

const getLevel = (callback) => {
    let level = ''
    db.collection('users').doc('Mihir Aggarwal').get()
    .then((doc) => {
        let data = doc.data()
        level = data.question
        callback(level)
    })
}

router.get('/', (req, res) => {
    getLevel((level) => { 
        db.collection('questions').doc(`q${level}`).get()
        .then((doc) => {
            if (doc.exists) {
                docId = doc.id;
                res.render('play', {data: {data: doc.data()}});
            }
            else {
                res.send('No data gotten')
            }
        }).catch((err) => {
            res.send(err.message);
        });
    });
});

router.post('/', (req, res) => {
    let answersMap = {}
    db.collection('users').doc('Mihir Aggarwal').get()
    .then((doc) => {
        if (doc.exists) {
            data = doc.data()
            answersMap = data.answers
        }
        else {
            res.send('No data found')
        }
        answersMap[`${docId.slice(1,)}`] = req.body.answer;
        db.collection('users').doc('Mihir Aggarwal').update({
            question: parseInt(docId.slice(1,)) + 1,
            answers: answersMap
        })
        res.redirect(req.get('referrer'));
    })
    .catch((err) => {
        res.send(err.message);
    })
})

module.exports = router
