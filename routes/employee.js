const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

const employeeCollection = 'Employee';

router.get('/', (req, res) => {
    res.json('asd');
});


router.get('/', (req, res) => {
    let collection = req.app.locals.collection(employeeCollection);
    collection.find({}).then((err, employee) => {
        if (err) return console.error(err);
        res.json(employee);
    })
});

router.get('/:id', (req, res) => {
    let collection = req.app.locals.collection(employeeCollection);
    collection.findOne({
        '_id' : req.params.id
    }, (err, result) => {
        if (err) res.status(400).send({'error': err});
        if (result === undefined)
            res.status(400).send('error: No emloyee matching that _id was found');
        else res.status(200).end(result)
    })
});

router.post('/', (req, res) => {
    let db = req.app.locals.collection(employeeCollection);
    const newEmployee = {
        name: req.body.name,
        phone: req.body.phone,
        note: req.body.note,
        email: req.body.email
    };
    db.collection(employeeCollection).insertOne({newEmployee}, (err, result) => {
        if (err) res.status(400).send({'error': err});
        res.status(200).send(result);
    })
});

router.delete('/:id', (req, res) => {
    req.app.locals.collection(employeeCollection).deleteOne({
        '_id': req.params.id
    }, (err, result) => {
       if(err) res.status(400).send({'error': err});
       res.status(200).send(result);
    })
});

router.put('/:id', async (req, res) => {
    const db = app.locals.collection(employeeCollection);
    const data = await db.findOne({
        '_id': req.params.id
    });
    db.updateOne({
        '_id': req.params.id
    }, {
        $set: {
            name: req.body.name || data.name,
            phone: req.body.phone || data.phone,
            note: req.body.note || data.note,
            email: req.body.email || data.email
        }
    }, {upsert: true}, (err, result) => {
        if(err) res.status(400).send({'error': err});
        res.status(200).send(result);
    })
});

module.exports = router;