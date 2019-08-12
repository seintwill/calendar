const express = require('express');
const router = express.Router();
const moment = require('moment');
const calendarCollection = 'calendar';
const employeeCollection = 'employee';

router.get('/', async (req, res) => {
    const query = {};

    if (req.query.end) query.start = {$lte: req.query.end};
    if (req.query.start) query.end = {$gte: req.query.start};
    if (req.query.ids) query.employee_id = {$in: ids};

    const filter = await req.app.locals.collection(calendarCollection).find(query).sort({start: 1}).toArray();

    const result =filter.reduce(function (memo, calendar) {
        if(calendar.start <= query.start) calendar.start = query.start;
        if(calendar.end >= query.end) calendar.end = query.end;

        return memo[calendar.employee_id] = {
            [calendar.status]: calendar.start.diff(calendar.end, 'days')
        }
    }, {});

    res.status(200).json(result);
});

module.exports = router;