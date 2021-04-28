const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

exports.getLoopers = functions.https.onRequest((req, res) => {
    admin
    .firestore()
    .collection('looper')
    .get()
    .then((data) => {
        let loopers = [];
        data.forEach((doc) => {
            loopers.push(doc.data());
        });
        return res.json(loopers);
    })
    .catch((err) => console.error(err));
});

exports.createLooper = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'Method not allowed' });
    }
    const newLooper = {
        body: req.body.body,
        looperHandle: req.body.looperHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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