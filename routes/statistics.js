const express = require('express');
const router = express.Router();
const moment = require('moment');
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

    const result = filter.reduce(function (memo, calendar) {
        if (moment(calendar.start).isBefore(date.start)) calendar.start = date.start;
        if (moment(calendar.end).isAfter(date.end)) calendar.end = date.end;

        memo[calendar.employee_id] = ([{
            'employee_id': calendar.employee_id,
            'calendar_id': calendar._id,
            [calendar.status]: moment(calendar.end).diff(calendar.start, 'days')
        }]);

        return memo;
    }, {});

    res.status(200).json(result);
});

module.exports = router;