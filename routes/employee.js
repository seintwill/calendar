const mongodb = require('mongodb');
const express = require('express');
const router = express.Router();
const employeeCollection = 'employee';
const calendarCollection = 'calendar';

router.get('/', async (req, res) => {
    try {
        const result = await req.app.locals.collection.collection(employeeCollection).find({}).toArray();
        res.status(200).json(result);
    } catch (e) {
        console.error(e);
    }
});

router.get('/:id', async (req, res) => {
	const result = await req.app.locals.collection.collection(employeeCollection).findOne({
        '_id' : mongodb.ObjectID(req.params.id)
    });
	if (result == null) res.status(404).json({message: 'Employee is not found'});
	else res.status(200).json(result);
});

router.post('/', async (req, res) => {
    const newEmployee = {
        name: req.query.name,
        phone: req.query.phone,
        email: req.query.email
    };
    if (req.body.note) newEmployee.note = req.body.note;
	req.app.locals.collection.collection(employeeCollection).insertOne(newEmployee, (err) => {
        if (err) res.status(400).json({error: err});
        else res.status(200).json({message: 'Calendar is created'});
    });
});

router.delete('/:id', async (req, res) => {
    await req.app.locals.collection.collection(employeeCollection).deleteOne({
        '_id': mongodb.ObjectID(req.params.id)
    }, (err, result) => {
       if(err) res.status(400).json({'error': err});
       req.app.locals.collection.collection(calendarCollection).remove({
           employee_id: mongodb(req.params.id)
       });
       res.status(200).json({message: `Employee ${req.params.id} is deleted`});
    })
});

router.put('/:id', async (req, res) => {
    const query = {};
    if (req.query.name) query.name = req.query.name;
    if (req.query.email) query.email = req.query.email;
    if (req.query.phone) query.phone = req.query.phone;
    if (req.query.note) query.note = req.query.note;
    if (req.query.calendar_id) query.calendar_id = mongodb.ObjectID(req.query.calendar_id);

	req.app.locals.collection.collection(employeeCollection).updateOne({
        '_id': mongodb.ObjectID(req.params.id)
    },
        {$set: query},
        {upsert: true}, (err, result) => {
        if(err) res.status(400).json({error: err});
        res.status(200).json('Update');
    })
});

module.exports = router;