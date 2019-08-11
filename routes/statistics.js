const express = require('express');
const router = express.Router();
const moment = require('moment');
const calendarCollection = 'Calendar';
const employeeCollection = 'Employee';

router.get('/', async (req, res) => {
    const query = {};

    if (req.query.end) query.start = {$lte: req.query.end};
    if (req.query.start) query.end = {$gte: req.query.start};
    if (req.query.ids) query.employee_id = {$in: ids};

    const result = await req.app.locals.collection(calendarCollection).find(query).sort({start: 1}).toArray();

    result.reduce(function (memo, calendar) {
        if(calendar.start <= query.start) calendar.start = query.start;
        if(calendar.end >= query.end) calendar.end = query.end;

        return memo[calendar.employee_id] = {
            [calendar.status]: calendar.start.diff(calendar.end, 'days')
        }
    }, {})
});