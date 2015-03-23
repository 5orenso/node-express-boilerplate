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
    libDate = require('../../lib/date'),
    date    = new libDate({}, {});

buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Date module:': {
        'isoDate wo/input': function () {
            var isoDateFormat = date.isoDate();
            assert.match(isoDateFormat, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[\+\-]\d{2}:\d{2}/);
        },
        'isoDate w/input': function () {
            var msec = Date.parse('March 21, 2012') / 1000;
            var d = new Date(msec);
            var isoDateFormat = date.isoDate(d);
            assert.match(isoDateFormat, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[\+\-]\d{2}:\d{2}/);
            assert.match(isoDateFormat, /2012-03-21T00:00:00\+\d{2}:\d{2}/);
        }
    }
});
