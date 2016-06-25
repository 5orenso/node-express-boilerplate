/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster  = require('buster'),
    assert  = buster.assert,
    appPath = __dirname + '/../../',
    mock    =  {
        logger: {
            log: function (type, msg, meta) {
                return {
                    type: type,
                    msg: msg,
                    meta: meta
                };
            }
        },
        dogstatsd: {
            timing: function () {

            },
            increment: function () {

            }
        }
    };

buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test logger:': {
        'call set/get': function () {
            var Metrics     = require(appPath + 'lib/metrics'),
                metrics     = new Metrics({}, mock);
            assert(metrics.set('boilerplate', 'metrics is fun'));
            assert.equals(metrics.get('boilerplate'), 'metrics is fun');
        },
        'call start': function () {
            var Metrics     = require(appPath + 'lib/metrics'),
                metrics     = new Metrics({}, mock);
            assert.isNumber(metrics.start());
        },
        'call timing': function () {
            var Metrics     = require(appPath + 'lib/metrics'),
                metrics     = new Metrics({ useDataDog: true }, mock);
            var metricsStart = metrics.start();
            assert.isNumber(metrics.timing('metrics.test', metricsStart));
        },
        'call increment': function () {
            var Metrics     = require(appPath + 'lib/metrics'),
                metrics     = new Metrics({ useDataDog: true }, mock);
            assert(metrics.increment('metrics.test'));
        }
    }
});

