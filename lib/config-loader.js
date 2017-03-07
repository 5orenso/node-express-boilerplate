/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var path = require('path'),
    appPath = path.normalize(__dirname + '/../'),
    ConfigValidator = require(appPath + 'lib/config-validator'),
    configValidator = new ConfigValidator();
var errors = [];

/**
 * Module for parsing config files.
 *
 * @constructor
 * @param {hash} opt - Constructor options.
 * @property {string} [config] The config files.
 */
var configLoader = function (opt) {
    opt = opt || {};
};

/**
 * Loader for config files.
 * @param {string} configFile - Full path to config file.
 * @property {filename} [config] Config file.
 * @returns {object} config - Config object
 */
configLoader.prototype.load = (configFile) => {
    let config = require(configFile);
    if (!configValidator.isValid(config)) {
        errors.push(configValidator.error());
        console.error(JSON.stringify(errors));
        return undefined;
    }
    return config;
};

configLoader.prototype.error = () => {
    return errors;
};

module.exports = configLoader;
