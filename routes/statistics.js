const express = require('express');
const router = express.Router();
const moment = require('moment');
const _ = require('underscore');
const calendarCollection = 'calendar';
const employeeCollection = 'employee';

router.get('/', async (req, res) => {
    const query = {};
    if (req.query.end) query.start = {$lte: moment(req.query.end).toDate()};
    if (req.query.start) query.end = {$gte: moment(req.query.start).toDate()};
    if (req.query.ids) query.employee_id = {$in: ids};

    const date = {};
    if (req.query.start) date.start = moment(req.query.start).toDate();
    if (req.query.end) date.end = moment(req.query.end).toDate();

    const filter = await req.app.locals.collection.collection(calendarCollection).find(query).sort({start: 1}).toArray();

    const result = _.groupBy(filter, (item) => {
        if (moment(item.start).isBefore(date.start)) item.start = date.start;
        if (moment(item.end).isAfter(date.end)) item.end = date.end;
        item[item.status] = moment(item.end).diff(item.start, 'days');

        return item.employee_id;
    });

    res.status(200).json(result);
});

module.exports = router;