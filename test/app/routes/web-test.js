'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    refute     = buster.refute,
    when       = require('when'),
    fs         = require('fs'),
    express    = require('express'),
    request    = require('request'),
    router     = require(__dirname + '/../../../app/routes/web');

var config = require(__dirname + '/../../../config/config-dist.js');
router.set_config(config, {});

var port = 4321;
var app = express();
app.use('/', router);
var server;

var response_headers = {
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
            request('http://127.0.0.1:' + port + '/', function (error, response, body) {
                assert.equals(response_headers['connection'], response.headers['connection']);
                assert.equals(response_headers['content-type'], response.headers['content-type']);
                assert.equals(200, response.statusCode);
                done();
            });

        },

        '/not-found.html': function (done) {
            request('http://127.0.0.1:' + port + '/not-found.html', function (error, response, body) {
                assert.equals(response_headers['connection'], response.headers['connection']);
                assert.equals(404, response.statusCode);
                done();
            });
        },

    }
});
