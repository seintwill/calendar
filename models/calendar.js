const calendar = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [''],
            properties : {
                employee_id: {
                    bsonType: 'objectId'
                },
                note :{
                    bsonType: 'string'
                },
                start: {
                    bsonType: 'date'
                },
                end: {
                    bsonType: 'date'
                },
                proportionOfWorkingDay: {
                    bsonType: 'number',
                    pattern: '/\d{0,8}/'
                },
                status: {
                    enum: ['vacation', 'remoteWork', 'sick', 'work'],
                    required: true
                }
            },
        }
    }
};

module.exports = calendar;



