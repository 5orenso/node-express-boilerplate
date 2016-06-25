'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    express    = require('express'),
    request    = require('request'),
    router     = require(__dirname + '/../../../app/routes/web');

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
    'content-type': 'text/html; charset=utf-8'
};

buster.testCase('app/routes/web', {
    setUp: function () {
        this.timeout = 2000;
        server = app.listen(port);
    },
    tearDown: function (done) {
//        console.log('web: tearDown');
        // TODO: Shutdown webserver.
        server.close(function() {
            done();
        });
    },
    'Test web routes:': {
        '/': function (done) {
            request('http://127.0.0.1:' + port + '/', function (error, response) {
                assert.equals(response.headers['content-type'], responseHeaders['content-type']);
                assert.equals(response.statusCode, 200);
                done();
            });
        },

        '/not-found.html': function (done) {
            request('http://127.0.0.1:' + port + '/not-found.html', function (error, response) {
                assert.equals(response.statusCode, 404);
                done();
            });
        }
    }
});
