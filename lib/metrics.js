/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

let _             = require('underscore'),
    StatsD        = require('node-dogstatsd').StatsD,
    dogstatsd     = new StatsD(),
    opts;

/**
 * Module for metrics.
 * @constructor
 * @param {hash} opt - Constructor options.
 */
function Metrics(opt, mockServices) {
    opts = opt || {};
    mockServices = mockServices || {};
    if (_.isObject(mockServices.dogstatsd)) {
        dogstatsd = mockServices.dogstatsd;
    }
}

/**
 * Set module opts value.
 * @param {string} key - Key name.
 * @param {*} value - Value for this key.
 * @returns {boolean} true - Returns true if success.
 */
Metrics.prototype.set = (key, value) => {
    opts[key] = value;
    return true;
};

/**
 * Get module opts value.
 * @param {string} key - Key name.
 * @returns {*} value - Value of key.
 */
Metrics.prototype.get = (key) => {
    return opts[key];
};

/**
 * Start timer.
 * @returns {number}
 */
Metrics.prototype.start = () => {
    return (new Date()).getTime();
};

/**
 * End timer and return time used.
 * @param {string} metricName - Name of metric to send to Datadog.com.
 * @param {number} startTime - Start of timer.
 * @returns {number} - Time used.
 */
Metrics.prototype.timing = (metricName, startTime) => {
    if (opts.useDataDog === true) {
        let timeInMillisec = (new Date()).getTime() - startTime;
        dogstatsd.timing(metricName, timeInMillisec);
        console.log('metrics.js => typeof: ', typeof timeInMillisec);
        return timeInMillisec;
    }
};

/**
 * Increment metric.
 * @param {string} metricName - Name of metric to send to Datadog.com
 * @returns {boolean} - True if everything is ok.
 */
Metrics.prototype.increment = (metricName) => {
    if (opts.useDataDog === true) {
        dogstatsd.increment(metricName);
        return true;
    }
};

module.exports = Metrics;
