const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/loopers', (req, res) => {
    admin
    .firestore()
    .collection('looper')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
        let loopers = [];
        data.forEach((doc) => {
            loopers.push({
                looperId: doc.id,
                body: doc.data().body,
                looperHandle: doc.data().looperHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(loopers);
    })
    .catch((err) => console.error(err));
});

app.post('/looper', (req, res) => {
    const newLooper = {
        body: req.body.body,
        looperHandle: req.body.looperHandle,
        createdAt: new Date().toISOString()
    };

    admin
        .firestore()
        .collection('looper')
        .add(newLooper)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created succesfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong ' });
            console.error(err);
        });
});

exports.api = functions.region("europe-west1").https.onRequest(app);