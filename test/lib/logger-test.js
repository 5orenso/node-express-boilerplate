/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster = require('buster'),
    assert = buster.assert,
    refute = buster.refute,
    when   = require('when'),
    logger = require('../../lib/logger')({}, {
        logger : {
            log: function (type, msg, meta) {
                return {
                    type: type,
                    msg: msg,
                    meta: meta
                };
            },
        }
    });

var log = {
    type: 'info',
    msg: /\d+ \[\d*\]: boilerplate -> logging -> is -> fun/,
    meta: null
};
var log_meta = {
    type: 'info',
    msg: /\d+ \[\d*\]: boilerplate -> \{"meta4":"yes it is!"\}/,
    meta: { meta1: 'logging', meta2: 'is', meta3: 'fun' }
};
var err = {
    type: 'error',
    msg: /\d+ \[\d*\]: boilerplate -> logging -> is -> fun/,
    meta: null
};
var err_meta = {
    type: 'error',
    msg: /\d+ \[\d*\]: boilerplate -> \{"meta4":"yes it is!"\}/,
    meta: { meta1: 'logging', meta2: 'is', meta3: 'fun' }
};
buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test logger:': {
        'log': function (done) {
            when( logger.log('info', 'boilerplate', 'logging', 'is', 'fun') )
                .done(function (obj) {
                    assert.equals(obj.type, log.type);
                    assert.match(obj.msg, log.msg);
                    done();
                });
        },
        'log w/meta': function (done) {
            when( logger.log('info', 'boilerplate', { meta1: 'logging', meta2: 'is', meta3: 'fun' }, { meta4: 'yes it is!'}  ) )
                .done(function (obj) {
                    assert.equals(obj.type, log_meta.type);
                    assert.match(obj.msg, log_meta.msg);
                    assert.equals(obj.meta, log_meta.meta);
                    done();
                });
        },
        'err': function (done) {
            when( logger.err('boilerplate', 'logging', 'is', 'fun') )
                .done(function (obj) {
                    assert.equals(obj.type, err.type);
                    assert.match(obj.msg, err.msg);
                    assert(true);
                    done();
                });
        },
        'err w/meta': function (done) {
            when( logger.err('boilerplate', { meta1: 'logging', meta2: 'is', meta3: 'fun' }, { meta4: 'yes it is!'} ) )
                .done(function (obj) {
                    assert.equals(obj.type, err_meta.type);
                    assert.match(obj.msg, err_meta.msg);
                    assert.equals(obj.meta, err_meta.meta);
                    done();
                });
        },
        'set/get': function () {
            assert(logger.set('boilerplate', 'logging is fun'));
            assert.equals(logger.get('boilerplate'), 'logging is fun');
        }

    }
});
