/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when     = require('when'),
    winston  = require('winston'),
    _        = require('underscore'),
    appPath  = __dirname + '/../',
    opts,
    logger;

function Logger(opt, mockServices) {
    opts = opt || {};
    mockServices = mockServices || {};

    if (mockServices.logger) {
        logger = mockServices.logger;
    } else if (!logger) {
        logger = new (winston.Logger)({
            transports: [
                // debug and all other levels above is logged to the console.
                new (winston.transports.Console)({ level: opts.logLevel })
                // new (winston.transports.File)({ filename: 'somefile.log' })
                // TODO: Setup standard weblogging using files or services.
                // TODO: Add more transporters. See https://github.com/flatiron/winston
            ]
        });
    }
}

Logger.prototype.log = function log() {
    var level = arguments[0];
    var msg = [];
    var meta = null;
    for (var i = 1, l = arguments.length; i < l; i++) {
        if (_.isString(arguments[i]) || _.isNumber(arguments[i])) {
            msg.push(arguments[i]);
        } else if (_.isObject(arguments[i]) && !meta) {
            meta = arguments[i];
        } else if (_.isObject(arguments[i])) {
            msg.push(JSON.stringify(arguments[i]));
        }
    }
    return when.promise(function (resolve, reject) {
        var ms = (new Date()).getTime();
        resolve(logger.log(level, ms + ' [' + (opts.workerId || '') + ']' + ': ' + msg.join(' -> '), meta));
    });
};

Logger.prototype.err = function err(message) {
    var msg = [];
    var meta = null;
    for (var i = 0, l = arguments.length; i < l; i++) {
        if (_.isString(arguments[i]) || _.isNumber(arguments[i])) {
            msg.push(arguments[i]);
        } else if (_.isObject(arguments[i]) && !meta) {
            meta = arguments[i];
        } else if (_.isObject(arguments[i])) {
            msg.push(JSON.stringify(arguments[i]));
        }
    }
    return when.promise(function (resolve, reject) {
        var ms = (new Date()).getTime();
        resolve(logger.log('error', ms + ' [' + (opts.workerId || '') + ']' + ': ' + msg.join(' -> '), meta));
        // TODO: Should handle errors.
    });
};

Logger.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

Logger.prototype.get = function get(key) {
    return opts[key];
};

module.exports = Logger;
