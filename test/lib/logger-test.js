/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster  = require('buster'),
    assert  = buster.assert,
    refute  = buster.refute,
    when    = require('when'),
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
        }
    };

var log = {
    type: 'info',
    msg: /\d+ \[\d*\]: boilerplate -> logging -> is -> fun/,
    meta: null
};
var logMeta = {
    type: 'info',
    msg: /\d+ \[\d*\]: boilerplate -> \{"meta4":"yes it is!"\}/,
    meta: { meta1: 'logging', meta2: 'is', meta3: 'fun' }
};
var err = {
    type: 'error',
    msg: /\d+ \[\d*\]: boilerplate -> logging -> is -> fun/,
    meta: null
};
var errMeta = {
    type: 'error',
    msg: /\d+ \[\d*\]: boilerplate -> \{"meta4":"yes it is!"\}/,
    meta: { meta1: 'logging', meta2: 'is', meta3: 'fun' }
};
buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
        delete require.cache[require.resolve(appPath + 'lib/logger')];
    },
    'Test logger:': {
        'log plain': function (done) {
            var Logger  = require(appPath + 'lib/logger');
            var logger  = new Logger({}, mock);
            when(logger.log('info', 'boilerplate', 'logging', 'is', 'fun'))
                .done(function (obj) {
                    assert.equals(obj.type, log.type);
                    assert.match(obj.msg, log.msg);
                    done();
                });
        },
        'log w/meta': function (done) {
            var Logger  = require(appPath + 'lib/logger');
            var logger  = new Logger({}, mock);
            when(logger.log('info', 'boilerplate',
                { meta1: 'logging', meta2: 'is', meta3: 'fun' },
                { meta4: 'yes it is!'}))
                .done(function (obj) {
                    assert.equals(obj.type, logMeta.type);
                    assert.match(obj.msg, logMeta.msg);
                    assert.equals(obj.meta, logMeta.meta);
                    done();
                });
        },
        'err plain': function (done) {
            var Logger  = require(appPath + 'lib/logger');
            var logger  = new Logger({}, mock);
            when(logger.err('boilerplate', 'logging', 'is', 'fun'))
                .done(function (obj) {
                    assert.equals(obj.type, err.type);
                    assert.match(obj.msg, err.msg);
                    assert(true);
                    done();
                });
        },
        'err w/meta': function (done) {
            var Logger  = require(appPath + 'lib/logger');
            var logger  = new Logger({}, mock);
            when(logger.err('boilerplate',
                { meta1: 'logging', meta2: 'is', meta3: 'fun' },
                { meta4: 'yes it is!'}))
                .done(function (obj) {
                    assert.equals(obj.type, errMeta.type);
                    assert.match(obj.msg, errMeta.msg);
                    assert.equals(obj.meta, errMeta.meta);
                    done();
                });
        },
        'set/get': function () {
            var Logger  = require(appPath + 'lib/logger');
            var logger  = new Logger({}, mock);
            assert(logger.set('boilerplate', 'logging is fun'));
            assert.equals(logger.get('boilerplate'), 'logging is fun');
        },
        'logger without mock': function () {
            var Logger  = require(appPath + 'lib/logger');
            var myLogger = new Logger({}, { logger: null });
            myLogger.log('test');
            assert(true);

        }
    }
});
