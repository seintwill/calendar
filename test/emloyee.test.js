const test = require('tape');
const request = require('supertest');
const express = require('express');

const Employee = require('../models/employee');
const app = require('../app');
let employeeId;

before(done => {
    app.on( 'APP_STARTED', () => {
        done()
    })
});

describe('API Integration Test', () => {
    it('Runs all tests', done => {
        test('post/employee', assert => {
            request(app)
                .post('/employee')
                .send(new Employee('test name', 'test phone', 'test note', 'test email'))
                .expect(200)
                .end((err, res) => {
                    if (err) return assert.fail(JSON.stringify(res));
                    assert.pass('Created a new employee successfully, test passed!');
                    assert.end()
                })
        });

        test('get/employee', assert => {
            request(app)
                .get('/employee')
                .expect(200)
                .end((err, res) => {
                    if (err) return assert.fail(JSON.stringify(res));
                    employeeId = res.body[0]._id;
                    assert.pass('Got all documents successfully, test passed!');
                    assert.end()
                })
        });

        test('get/employee/:id', assert => {
            request(app)
                .get(`/employee/${employeeId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return assert.fail(JSON.stringify(res));
                    assert.pass('Got a specific document successfully, test passed!');
                    assert.end()
                })
        });

        test('put/employee/:id', assert => {
            request(app)
                .put(`/api/documents/${documentId}`)
                .send(new Employee('test name edit', 'test phone edit', 'test note edit', 'test email edit'))
                .expect(200)
                .end((err, res) => {
                    if (err) return assert.fail(JSON.stringify(res));
                    assert.pass('Edited a employee successfully, test passed!');
                    assert.end()
                })
        });

        test('delete/employee/:id', assert => {
            request(app)
                .delete(`/employee/${employeeId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return assert.fail(JSON.stringify(res));
                    assert.pass('Deleted a specific employee successfully, test passed!');
                    assert.end();
                    done()
                })
        })
    })
});
