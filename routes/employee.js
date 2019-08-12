const mongodb = require('mongodb');
const express = require('express');
const router = express.Router();
const employeeCollection = 'employee';
const calendarCollection = 'calendar';

router.get('/', async (req, res) => {
	const result = await req.app.locals.collection(employeeCollection).find({});
	res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
	const result = await req.app.locals.collection(employeeCollection).findOne({
        '_id' : mongodb.ObjectID(req.params.id)
    });
	if (result == null) res.status(404).json({message: 'Employee is not found'});
	else res.status(200).json(result);
});

router.post('/', async (req, res) => {
    const newEmployee = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    };
    if (req.body.note) newEmployee.note = req.body.note;
	req.app.locals.collection(employeeCollection).insertOne(newEmployee, (err) => {
        if (err) res.status(400).json({error: err});
        else res.status(200).json({message: 'Calendar is created'});
    });
});

router.delete('/:id', async (req, res) => {
    await req.app.locals.collection(employeeCollection).deleteOne({
        '_id': mongodb.ObjectID(req.params.id)
    }, (err, result) => {
       if(err) res.status(400).json({'error': err});
       req.app.locals.collection(calendarCollection).delete({
           employee_id: mongodb.ObjectID(req.params.id)
       });
       res.status(200).json({message: `Employee ${req.params.id} is deleted`});
    })
});

router.put('/:id', async (req, res) => {
    const query = {};
    if (req.body.name) query.name = req.body.name;
    if (req.body.email) query.email = req.body.email;
    if (req.body.phone) query.phone = req.body.phone;
    if (req.body.note) query.note = req.body.note;
    if (req.body.calendar_id) query.calendar_id = mongodb.ObjectID(req.body.calendar_id);

	await app.locals.collection(employeeCollection).updateOne({
        '_id': req.params.id
    },
        {$set: query},
        {upsert: true}, (err, result) => {
        if(err) res.status(400).json({error: err});
        res.status(200).json(result);
    })
});

module.exports = router;