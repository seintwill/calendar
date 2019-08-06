const MongoClient = require('mongodb').MongoClient;
const Employee = require('../models/employee');
const express = require('express');
const app = express();

const urlMongodb = 'mongodb://localhost:27017/calendar';

MongoClient.connect(urlMongodb,{useNewUrlParser: true}, async function(err, client) {
    if(err) console.log(err);
    app.listen(3000);
    const db = client.db('calendar');
    const collection = db.collection('Employee');
    const emp = await db.createCollection('Employee', {validator: {$jsonSchema: Employee}}, (err, res) => {
        if (err) console.log(err)
        else console.log('Collection created!');
    });
    const newEmployee = {
        name: 'test name',
        email: 'emailemail.com',
        phone: 'asd',
        note: 'test note',
    };
    const result = await collection.insertOne(newEmployee, {$jsonSchema: Employee});
    // const result = await collection.findOne({
    //     '_id': 1
    // });
    // console.log(result);
});
