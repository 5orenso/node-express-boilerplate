/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var path = require('path'),
    appPath = path.normalize(__dirname + '../../'),
    ConfigValidator = require(appPath + 'lib/config-validator'),
    configValidator = new ConfigValidator();
var errors = [];

var configLoader = function (opt, mockServices) {
    opt = opt || {};
    mockServices = mockServices || {};
};

configLoader.prototype.load = function isValid(configFile) {
    var config = require(configFile);
    if (!configValidator.isValid(config)) {
        errors.push(configValidator.error());
        console.error(JSON.stringify(errors));
        return undefined;
    }
    return config;
};

configLoader.prototype.error = function error() {
    return errors;
};

module.exports = configLoader;
