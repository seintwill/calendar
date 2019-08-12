const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const employee = require('./models/employee');
const calendar = require('./models/calendar');
const routerStatistics = require('./routes/statistics');
const routerEmployee = require('./routes/employee');
const routerCalendar = require('./routes/calendar');

const urlMongodb = 'mongodb://localhost:27017/calendar';

app.use('/employee', routerEmployee);
app.use('/calendar', routerCalendar);
app.use('/statistics', routerStatistics);

MongoClient.connect(urlMongodb, function(err, client) {
    if(err) console.log(err);
    client.createCollection('employee', employee);
    client.createCollection('calendar', calendar);
    app.locals.collection = client.db('calendar');
    app.listen(3000);
});

module.exports = app;