const mongodb = require('mongodb');
const express = require('express');
const router = express.Router();
const employeeCollection = 'employee';
const calendarCollection = 'calendar';

router.get('/', async (req, res) => {
    const query = {};
    if (req.query.status) query.status = {$eq: req.query.status};
    if (req.query.end) query.start = {$lte: req.query.end};
    if (req.query.start) query.end = {$gte: req.query.start};

	const result = await req.app.locals.collection(employeeCollection).find(query).sort({start: 1}).toArray();

	result.map(item => {
	    if(item.start <= query.start) item.start = query.start;
	    if(item.end >= query.end) item.end = query.end;
    });

    res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
    const result = await req.app.locals.collection(calendarCollection).findOne({
        '_id' : mongodb.ObjectID(req.params.id)
    });
    if (result == null) res.status(404).json('Calendar is not found');
    else res.status(200).json(result);
});

router.post('/', async (req, res) => {
    const newCalendar = {
        employee_id: mongodb.ObjectID(req.body.employee_id),
        start: req.body.start,
        end: req.body.end,
        status: req.body.status,
	    proportionOfWorkingDay: req.body.proportionOfWorkingDay
    };

    if (req.body.note) newCalendar.note = req.body.note;

    const result = await req.app.locals.collection(calendarCollection).insertOne(newCalendar);

    await req.app.locals.collection(employeeCollection).updateOne({
        '_id': mongodb.ObjectID(req.body.employee_id)
    }, {$push: {calendar_id: result._id}});

    res.status(200).json('Calendar is created');
});

router.delete('/:id', async (req, res) => {
    await req.app.locals.collection(calendarCollection).findOneAndDelete({
        '_id': mongodb.ObjectID(req.params.id)
    }, (err, result) => {
        if (err) res.status(400).send({'error': err});

        req.app.locals.collection(employeeCollection).updateOne({
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
    if (req.body.employee_id) query.employee_id = mongodb.ObjectID(req.body.employee_id);
    if (req.body.start) query.start = req.body.start;
    if (req.body.end) query.end = req.body.end;
    if (req.body.status && status.includes(req.body.status)) query.status = req.body.status;
    if (req.body.note) query.note = req.body.note;

    req.app.locals.collection(calendarCollection).updateOne({
        '_id': req.params.id
    }, {
        $set: query
    }, (err, result) => {
        if (err) res.status(400).json({'error': err});
        res.status(200).json(result);
    })
});

module.exports = router;