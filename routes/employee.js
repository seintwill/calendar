const express = require('express');
const router = express.Router();

const employeeCollection = 'Employee';
const calendarCollection = 'Calendar';

router.get('/', async (req, res) => {
	const result = await req.app.locals.collection(employeeCollection).find({});
	res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
	const result = await req.app.locals.collection(employeeCollection).findOne({
        '_id' : req.params.id
    });
	if (result == null) res.status(404).json('Employee is not found')
	else res.status(200).json(result);
});

router.post('/', async (req, res) => {
    const newEmployee = {
        name: req.body.name,
        phone: req.body.phone,
        note: req.body.note,
        email: req.body.email
    };
	req.app.locals.collection(employeeCollection).insertOne({newEmployee}, (err, result) => {
        if (err) res.status(400).send({'error': err});
        res.status(200).send(result);
    });
});

router.delete('/:id', async (req, res) => {
    await req.app.locals.collection(employeeCollection).deleteOne({
        '_id': req.params.id
    }, (err, result) => {
       if(err) res.status(400).send({'error': err});
       req.app.locals.collection(calendarCollection).deleteOne({
           employee_id: req.params.id
       });
       res.status(200).send(`Employee ${req.params.id} is deleted`);
    })
});

router.put('/:id', async (req, res) => {
    const data = await app.locals.collection(employeeCollection).findOne({
        '_id': req.params.id
    });
	await app.locals.collection(employeeCollection).updateOne({
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