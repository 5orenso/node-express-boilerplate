/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
let validator  = require('is-my-json-valid');
let configSchema = require('./config-schema.js');
let validate = validator(configSchema);
let errors = [];

/**
 * Module for validating config files.
 * @constructor
 * @param {hash} opt - Constructor options.
 */
let configValidator = function (opt) {
    opt = opt || {};
};

configValidator.prototype.isValid = (json) => {
    let isJsonValid = validate(json);
    if (!isJsonValid) {
        errors = validate.errors;
    }
    return isJsonValid;
};

configValidator.prototype.error = () => {
    return errors;
};

module.exports = configValidator;
