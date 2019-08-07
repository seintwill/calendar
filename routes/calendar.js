const express = require('express');
const router = express.Router();
const calendarCollection = 'Calendar';
const employeeCollection = 'Employee';

router.get('/', async (req, res) => {
	const result = await req.app.locals.collection(calendarCollection).find({});
	res.json(result);
});

router.get('/:id', async (req, res) => {
    const result = await req.app.locals.collection(calendarCollection).findOne({
        '_id' : req.params.id
    });
    if (result == null) res.status(404).json('Calendar is not found');
    else res.status(200).json(result);
});

router.post('/', async (req, res) => {
    const newCalendar = {
        employee_id: req.body.employee_id,
        note: req.body.note,
        info: req.body.info
    };
    const result = await req.app.locals.collection(calendarCollection).insertOne({newCalendar});

    await req.app.locals.collection(employeeCollection).updateOne({
        '_id': req.body.employee_id
    }, {$push: {calendar_id: result._id}});

    res.status(200).json('Calendar is created');
});

router.delete('/:id', async (req, res) => {
    await req.app.locals.collection(calendarCollection).findOneAndDelete({
        '_id': req.params.id
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
    const data = req.app.locals.collection(calendarCollection).findOne({
        '_id': req.params.id
    });

    req.app.locals.collection.updateOne({
        '_id': req.params.id
    }, {
        $set: {
            employee_id: req.body.employeeId || data.employee_id,
            note: req.body.note || data.note,
            info: req.body.info || data.info         //object is true
        }
    }, (err, result) => {
        if(err) res.status(400).send({'error': err});
        res.status(200).send(result);
    })
});

module.exports = router;