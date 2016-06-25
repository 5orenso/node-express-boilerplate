'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    express    = require('express'),
    request    = require('request'),
    router     = require(__dirname + '/../../../app/routes/ip');

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

buster.testCase('app/routes/ip', {
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

        '/ip?q=51.175.83.151': function (done) {
            request('http://127.0.0.1:' + port + '/?q=51.175.83.151', function (error, response, body) {
                var json = JSON.parse(body);
                assert.equals(response.statusCode, 200);
                assert.equals(json.timezone, 'Europe/Oslo');
                assert.equals(json.city, 'Oslo');
                assert.equals(json.country, 'Norway');
                done();
            });
        },

        '/ip?q=51.175.83.151&callback=foobar': function (done) {
            request('http://127.0.0.1:' + port + '/?q=51.175.83.151&callback=foobar',
                function (error, response, body) {
                    //console.log(body);
                    assert.equals(response.statusCode, 200);
                    assert.match(body, /foobar\(.+?\)/);
                    assert.match(body, /"timezone":"Europe\/Oslo"/);
                    assert.match(body, /"city":"Oslo"/);
                    assert.match(body, /"country":"Norway"/);
                    assert.match(body, /"poweredBy":"http:\/\/www.maxmind.com"/);
                    done();
                });
        },

        '/ip': function (done) {
            request('http://127.0.0.1:' + port + '/',
                function (error, response, body) {
                    //console.log(body);
                    assert.equals(response.statusCode, 200);
                    assert.match(body, /"loc": "undefined,undefined"/);
                    assert.match(body, /"poweredBy": "http:\/\/www.maxmind.com"/);
                    done();
                });
        }
    }
});
