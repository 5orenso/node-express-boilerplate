/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var validator  = require('is-my-json-valid');
var configSchema = require('./config-schema.js');
var validate = validator(configSchema);
var errors = [];

/**
 * Module for validating config files.
 * @constructor
 * @param {hash} opt - Constructor options.
 */
var configValidator = function (opt, mockServices) {
    opt = opt || {};
    mockServices = mockServices || {};
};

configValidator.prototype.isValid = function isValid(json) {
    var isJsonValid = validate(json);
    if (!isJsonValid) {
        errors = validate.errors;
    }
    return isJsonValid;
};

configValidator.prototype.error = function error() {
    return errors;
};

module.exports = configValidator;
