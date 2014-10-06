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
    date   = require('../../lib/date')({}, {});

buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Date module:': {
        'iso_date wo/input': function () {
            var iso_date_format = date.iso_date();
            assert.match(iso_date_format, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[\+\-]\d{2}:\d{2}/);
        },
        'iso_date w/input': function () {
            var sec = 1412597896; //Date.parse("March 21, 2012") / 1000;
            var d = new Date(sec);
            var iso_date_format = date.iso_date(d);
            assert.match(iso_date_format, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[\+\-]\d{2}:\d{2}/);
            assert.match(iso_date_format, /2014-10-06T\d{2}:18:16.000\+\d{2}:\d{2}/);
        }
    }
});
