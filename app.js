const express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    app = express(),
    moment = require('moment'),
    employee = require('./models/employee'),
    calendar = require('./models/calendar');

const urlMongodb = 'mongodb://localhost:27017/calendar';

// app.use('/employee', employee);

MongoClient.connect(urlMongodb, function(err, client) {
    if(err) console.log(err);
    // client.createCollection('employee', employee);
    // client.createCollection('calendar', calendar);
    app.locals.collection = client.db('calendar');
    app.listen(3000);
});

app.get('/', (req, res) => {

    const start = moment([2014, 0, 5]);
    const end = moment([2013, 0, 10]);
    console.log(start.diff(end, 'days'));

    const query = {};

    for (key in req.query) {
        console.log(`${key}: ${req.query[key]}`);
    }
    console.log(query.start >= 1);
    res.json(`params: ${query.status}`);
});

module.exports = app;