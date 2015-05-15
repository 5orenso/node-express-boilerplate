'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    express    = require('express'),
    request    = require('request'),
    router     = require(__dirname + '/../../../app/routes/api');

var config = require(__dirname + '/../../../config/config-dist.js');
router.setConfig(config, {
    workerId: 1
});

var port = 4321;
var app = express();
app.use('/', router);
var server;

var responseHeaders = {
    connection: 'keep-alive',
    'content-type': 'application/json; charset=utf-8'
};

buster.testCase('app/routes/api', {
    setUp: function () {
        this.timeout = 2000;
        server = app.listen(port);
    },
    tearDown: function (done) {
        // TODO: Shutdown webserver.
        server.close(function() {
            done();
        });
    },
    'Test web routes:': {
        'OPTIONS /articles': function (done) {
            request({
                method: 'OPTIONS',
                uri: 'http://127.0.0.1:' + port + '/articles',
                body: JSON.stringify({})
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(200, response.statusCode);
                done();
            });
        },

        'GET /articles': function (done) {
            request({
                method: 'GET',
                uri: 'http://127.0.0.1:' + port + '/articles'
                //body: JSON.stringify({})
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(200, response.statusCode);
                done();
            });
        },

        'GET /articles/1/comments': function (done) {
            request({
                method: 'GET',
                uri: 'http://127.0.0.1:' + port + '/articles/1/comments'
                //body: JSON.stringify({})
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(200, response.statusCode);
                done();
            });
        },

        'POST /articles': function (done) {
            request({
                method: 'POST',
                uri: 'http://127.0.0.1:' + port + '/articles',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        id: 'abc123',
                        title: 'test article'
                    }
                })
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(201, response.statusCode);
                done();
            });
        },

        'POST /articles/1/comments': function (done) {
            request({
                method: 'POST',
                uri: 'http://127.0.0.1:' + port + '/articles/1/comments',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        id: 'abc123',
                        title: 'test article'
                    }
                })
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(201, response.statusCode);
                done();
            });
        },

        'PATCH /articles/1': function (done) {
            request({
                method: 'PATCH',
                uri: 'http://127.0.0.1:' + port + '/articles/1',
                body: JSON.stringify({})
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(200, response.statusCode);
                done();
            });
        },

        'PUT /articles/1': function (done) {
            request({
                method: 'PUT',
                uri: 'http://127.0.0.1:' + port + '/articles/1',
                body: JSON.stringify({})
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(200, response.statusCode);
                done();
            });
        },

        'DELETE /articles/1': function (done) {
            request({
                method: 'DELETE',
                uri: 'http://127.0.0.1:' + port + '/articles/1'
            }, function (error, response) {
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(204, response.statusCode);
                done();
            });
        },

        'DELETE /articles/1/comments/1': function (done) {
            request({
                method: 'DELETE',
                uri: 'http://127.0.0.1:' + port + '/articles/1/comments/1'
            }, function (error, response) {
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(204, response.statusCode);
                done();
            });
        },

        'GET /not-found-endpoint': function (done) {
            request({
                method: 'GET',
                uri: 'http://127.0.0.1:' + port + '/not-found-endpoint',
                body: JSON.stringify({})
            }, function (error, response) {
                //console.log(response.headers, body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(501, response.statusCode);
                done();
            });
        },

        'POST /articles w/borked JSON': function (done) {
            request({
                method: 'POST',
                uri: 'http://127.0.0.1:' + port + '/articles',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: 'broken JSON string.'
            }, function (error, response) {
                console.log(response.headers, response.body);
                // TODO: Check response and compare.
                assert.equals(responseHeaders.connection, response.headers.connection);
                assert.equals(responseHeaders['content-type'], response.headers['content-type']);
                assert.equals(201, response.statusCode);
                done();
            });
        }

    }
});
