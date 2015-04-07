/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster = require('buster'),
    assert = buster.assert,
    when   = require('when');

buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test module:': {
        'dummy sync test': function () {
            assert(true);
        },
        'dummy async test': function (done) {
            // Do some async stuff and call done.
            assert(true);
            done();
        },
        'dummy async w/promises test': function (done) {
            when(function functionWhichReturnsAPromise() {
                return 'my promise';
            })
                .done(function success() {
                    assert(true);
                    done();
                }, function error() {
                    assert(true);
                    done();
                });
        }
    }
});
