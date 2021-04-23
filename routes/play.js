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
let ans = '';
let startTime = 0;
let ansPoints = 0;
let pseudoStart = 0
let winsw = false;
let relCheck = false

const getLevel = (callback) => {
    let level = 0
    db.collection('users').doc('Mihir Aggarwal').get()
    .then((doc) => {
        let data = doc.data()
        level = data.question
        relChecker = data.reload
        startPrev = data.start_time
        callback(level, relChecker, startPrev)
    })
}

const setPoints = (winsw, answerTime, currentAns, callback) => {
    if (winsw) {
        ansPoints = answerTime*(-1)
    } else {
        if (answerTime <= 30){
            if (currentAns == ans) {
                ansPoints = 100-(answerTime*2)
            } else {
                ansPoints = answerTime*(-1)
            }
        } else {
            ansPoints = answerTime*(-1)
        }         
    }
    callback(ansPoints)
}

router.get('/', (req, res) => {
    winsw = false
    getLevel((level, relChecker, startPrev) => { 
        db.collection('questions').doc(`q${level}`).get()
        .then((doc) => {
            if (doc.exists) {
                docId = doc.id;
                relCheck = relChecker;
                pseudoStart = startPrev;
                res.render('play', {data: {data: doc.data()}})
                if (!relCheck){
                    startTime = new Date().getTime() / 1000;
                    db.collection('users').doc('Mihir Aggarwal').update({
                        start_time: parseInt(startTime)
                    });
                } else {
                    startTime = pseudoStart;
                    winsw = true;
                }
                ans = doc.data().answer
                db.collection('users').doc('Mihir Aggarwal').update({
                    reload: true
                });
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
    let answerTime = Math.floor((new Date().getTime() / 1000) - startTime);
    db.collection('users').doc('Mihir Aggarwal').get()
    .then((doc) => {
        if (doc.exists) {
            data = doc.data()
            answersMap = data.answers
            allTimes = data.time
            points = data.points
            totalPoints = data.total_points
        }
        else {
            res.send('No data found')
        }
        answersMap[`${docId.slice(1,)}`] = req.body.answer;
        allTimes[`${docId.slice(1,)}`] = answerTime;
        setPoints(winsw, answerTime, req.body.answer, (ansPoints) => {
            points[`${docId.slice(1,)}`] = ansPoints
            totalPoints = parseInt(totalPoints)
            totalPoints += ansPoints
            db.collection('users').doc('Mihir Aggarwal').update({
                question: parseInt(docId.slice(1,)) + 1,
                answers: answersMap,
                time: allTimes,
                points: points,
                total_points: totalPoints,
                reload: false
            }).then(res.redirect('back'))
        });
    })
    .catch((err) => {
        res.send(err.message);
    })
})

router.post('/switch', (req, res) => {
    let reqj = req.body
    if (reqj["winsw"]) {
        winsw = true;
    }
})

module.exports = router
