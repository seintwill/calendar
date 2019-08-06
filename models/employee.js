const employee = {
            bsonType: 'object',
            required: ['email, phone'],
            properties : {
                name: {
                    bsonType: 'string'
                },
                email: {
                    bsonType: 'string',
                    pattern: '/^[0-9a-z-\\.]+\\@[0-9a-z-]{2,}\\.[a-z]{2,}$/i'
                },
                phone: {
                    bsonType: 'number',
                    patter: '/^[0-9]/'
                },
                note :{
                    bsonType: 'string'
                },
                calendar_id: {
                    bsonType: 'objectId'

                }
            }
};

module.exports = employee;

