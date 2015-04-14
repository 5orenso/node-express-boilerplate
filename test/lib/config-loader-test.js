/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster  = require('buster'),
    assert  = buster.assert,
    refute  = buster.refute,
    _ = require('underscore'),
    path = require('path'),
    appPath = path.normalize(__dirname + '/../../');

var ConfigLoader,
    configLoader;

buster.testCase('lib/config-loader', {
    setUp: function () {
        ConfigLoader = require('../../lib/config-loader');
        configLoader = new ConfigLoader();
    },
    tearDown: function () {
        delete require.cache[require.resolve('../../lib/config-loader')];
    },
    'config-validator:': {
        'load valid config file': function () {
            var config = configLoader.load(appPath + 'config/config-dist.js');
            assert(_.isObject(config));
        },
        'load invalid config file': function () {
            var config = configLoader.load(appPath + 'test/lib/config-jsons.js');
            var errors = configLoader.error();
            assert(_.isArray(errors));
            refute(_.isObject(config));
        }

    }
});
