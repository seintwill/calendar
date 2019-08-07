const express = require('express');
const router = express.Router();
const calendarCollection = 'Calendar';
const employeeCollection = 'Employee';

router.get('/', (req, res) => {
    res.json('asd');
});


router.get('/', (req, res) => {
    let collection = req.app.locals.collection(calendarCollection);
    collection.find({}).then((err, calendar) => {
        if (err) return console.error(err);
        res.json(calendar);
    })
});

router.get('/:id', (req, res) => {
    req.app.locals.collection(calendarCollection).findOne({
        '_id' : req.params.id
    }, (err, result) => {
    if (err) res.status(400).send({'error': err});
    if (result === undefined)
        res.status(400).send('error: No calendar matching that _id was found');
    else res.status(200).end(result)
    });
});

router.post('/', (req, res) => {
    const newCalendar = {
        employee_id: req.body.employee_id,
        note: req.body.note,
        info: req.body.info                                 //check req.body.info
    };
    const result = req.app.locals.collection(calendarCollection)
        .insertOne({newCalendar}, (err, result) => {
        if (err) res.status(400).send({'error': err});
        res.status(200).send(result);
    });

    req.app.locals.collection(employeeCollection).updateOne({
        '_id': req.body.employee_id
    }, {$push: {calendar_id: result._id}});

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