/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster  = require('buster'),
    assert  = buster.assert,
    refute  = buster.refute;

var Validator;
var validator;

var jsonExamples = require('./config-jsons.js');
var configJsonValid = jsonExamples.valid;
var configJsonInvalid = jsonExamples.invalid;

buster.testCase('lib/config-validator', {
    setUp: function () {
        Validator = require('../../lib/config-validator');
        validator = new Validator();
    },
    tearDown: function () {
        delete require.cache[require.resolve('../../lib/config-validator')];
        delete require.cache[require.resolve('../../lib/config-schema')];
    },
    'config-validator:': {
        'isValid w/valid JSON': function () {
            for (var i = 0; i < configJsonValid.length; i++) {
                var json = configJsonValid[i];
                var isValid = validator.isValid(json);
                if (!isValid) {
                    console.log(JSON.stringify(json, null, 4), validator.error());
                }
                assert(isValid);
                assert(validator.error(), []);
            }
            console.log('Tested ' + configJsonValid.length + ' valid config JSONs.');
        },

        'isValid w/invalid JSON': function () {
            for (var i = 0; i < configJsonInvalid.length; i++) {
                var json = configJsonInvalid[i];
                var isValid = validator.isValid(json);
                if (isValid) {
                    console.log(JSON.stringify(json, null, 4), 'Is valid config. THIS SHOULD FAIL!');
                }
                refute(isValid);
            }
            console.log('Tested ' + configJsonInvalid.length + ' invalid config JSONs.');
        }
    }
});
