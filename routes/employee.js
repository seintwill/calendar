const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

router.get('/', (req, res) => {
    res.json('asd');
});


router.get('/', (req, res) => {
    let collection = req.app.locals.collection('employee');
    collection.find({}).then((err, employee) => {
        if (err) return console.error(err);
        res.json(employee);
    })
});

router.get('/:id', (req, res) => {
    let collection = req.app.locals.collection('employee');
    collection.findOne({
        '_id' : req.params.id
    }, (err, result) => {
        if (err) res.status(400).send({'error': err});
        if (result === undefined) res.status(400).send('error: No emloyee matching that _id was found');
        else res.status(200).end(result)
    })
});

router.post('/', (req, res) => {
    let db = req.app.locals.collection('employee');
    const newEmployee = {
        name: req.body.name,
        phone: req.body.phone,
        note: req.body.note,
        email: req.body.email
    };
    db.employee.insertOne({newEmployee}, (err, result) => {
        if (err) res.status(400).send({'error': err});
        res.status(200).send(result);
    })
});

router.delete('/:id', (req, res) => {
    req.app.locals.collection.deleteOne({
        '_id': req.params.id
    }, (err, result) => {
       if(err) res.status(400).send({'error': err});
       res.status(200).send(result);
    })
});

router.put('/:id', (req, res) => {
    req.app.locals.collection.updateOne({
        '_id': req.params.id
    }, {
        $set: {
            name: req.body.name,
            phone: req.body.name,
            note: req.body.name,
            email: req.body.email
        }
    }, (err, result) => {
        if(err) res.status(400).send({'error': err})
        res.status(200).send(result);
    })
});

module.exports = router;