const mongodb = require('mongodb');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const employeeCollection = 'employee';
const calendarCollection = 'calendar';

router.get('/', async (req, res) => {
    const query = {};
    const date = {};
    if (req.query.start) date.start = moment(req.query.start).toDate();
    if (req.query.end) date.end = moment(req.query.end).toDate();

    if (req.query.status) query.status = {$eq: req.query.status};
    if (req.query.end) query.start = {$lte: date.end};
    if (req.query.start) query.end = {$gte: date.start};

	const result = await req.app.locals.collection.collection(calendarCollection).find(query).sort({start: 1}).toArray();

	result.map(item => {
	    if (moment(item.start).isBefore(date.start)) item.start = date.start;
	    if (moment(item.end).isAfter(date.end)) item.end = date.end;
    });

    res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
    const result = await req.app.locals.collection.collection(calendarCollection).findOne({
        '_id' : mongodb.ObjectID(req.params.id)
    });
    if (result == null) res.status(404).json('Calendar is not found');
    else res.status(200).json(result);
});

router.post('/', async (req, res) => {
    const newCalendar = {
        employee_id: req.query.employee_id,
        start: moment(req.query.start).toDate(),
        end: moment(req.query.end).toDate(),
        status: req.query.status,
	    proportionOfWorkingDay: req.query.proportionOfWorkingDay
    };

    if (req.query.note) newCalendar.note = req.query.note;

    const result = await req.app.locals.collection.collection(calendarCollection).insertOne(newCalendar);

    await req.app.locals.collection.collection(employeeCollection).updateOne({
        '_id': mongodb.ObjectID(req.body.employee_id)
    }, {$push: {calendar_id: result._id}});

    res.status(200).json('Calendar is created');
});

router.delete('/:id', async (req, res) => {
    await req.app.locals.collection.collection(calendarCollection).findOneAndDelete({
        '_id': mongodb.ObjectID(req.params.id)
    }, (err, result) => {
        if (err) res.status(400).send({'error': err});

        req.app.locals.collection.collection(employeeCollection).updateOne({
            '_id': result.employee_id
        }, {
            $pull: {
                calendar_id: result._id
            }
        });
    });

    res.status(200).send('Deleted');
});

router.put('/:id', (req, res) => {
    const query = {};
    const status = ['vacation', 'remoteWork', 'sick', 'work'];
    if (req.query.employee_id) query.employee_id = mongodb.ObjectID(req.query.employee_id);
    if (req.query.start) query.start = moment(req.query.start).toDate();
    if (req.query.end) query.end = moment(req.query.end).toDate();
    if (req.query.status && status.includes(req.query.status)) query.status = req.query.status;
    if (req.query.note) query.note = req.query.note;

    req.app.locals.collection.collection(calendarCollection).updateOne({
        '_id': mongodb.ObjectID(req.params.id)
    }, {
        $set: query
    }, (err, result) => {
        if (err) res.status(400).json({'error': err});
        res.status(200).json(result);
    })
});

module.exports = router;