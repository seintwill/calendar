const MongoClient = require('mongodb').MongoClient;
const Employee = require('../models/employee');
const express = require('express');
const app = express();
const objectId = require('mongodb').objectId;

const urlMongodb = 'mongodb://localhost:27017/calendar1';
const nameCollection = 'example1';

MongoClient.connect(urlMongodb,{useNewUrlParser: true}, async function(err, client) {
    if(err) console.log(err);
    app.listen(7000);
    const db = await client.db('calendar2');
    db.dropCollection(nameCollection);
    // const collection = await db.collection('Employee');
    // await db.createCollection(nameCollection, Employee);
    const newEmployee = {
        // name: 't1',
        email: 't1tt@mail.ru',
        // phone: 91,
        // note: 't1',
        // calendar_id: objectId
    };
    // await db.collection(nameCollection).createIndex({email:1}, {unique: true});
    const insert = await db.collection(nameCollection).insertOne({
        name: '123' || 'yulia',
        email: 'asasdxc@asd.ru',
        phone: 911,
        note: 'dick'
    });

    console.log(`insert: ${insert}`);

     const result = await db.collection(nameCollection).find({name: ''}).toArray();
     console.log(result);
         // db.collection(nameCollection).updateOne({'name': 'popova'}, {
         //     $set: {
         //         name: 'yulia' || result.name,
         //         phone: null || result.phone,
         //         note: 'big' || result.name,
         //         email: result.email
         //     }
         // }, {upsert: true}).then(res => console.log(res));
    // console.log(result);
});
