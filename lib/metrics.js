/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var _             = require('underscore'),
    StatsD        = require('node-dogstatsd').StatsD,
    dogstatsd     = new StatsD(),
    opts;

function Metrics(opt, mockServices) {
    opts = opt || {};
    mockServices = mockServices || {};
    if (_.isObject(mockServices.dogstatsd)) {
        dogstatsd = mockServices.dogstatsd;
    }
}

Metrics.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

Metrics.prototype.get = function get(key) {
    return opts[key];
};

Metrics.prototype.start = function start() {
    return (new Date()).getTime();
};

Metrics.prototype.timing = function timing(metricName, startTime) {
    if (opts.useDataDog === true) {
        var timeInMillisec = (new Date()).getTime() - startTime;
        dogstatsd.timing(metricName, timeInMillisec);
        console.log('metrics.js => typeof: ', typeof timeInMillisec);
        return timeInMillisec;
    }
};

Metrics.prototype.increment = function increment(metricName) {
    if (opts.useDataDog === true) {
        dogstatsd.increment(metricName);
        return true;
    }
};

module.exports = Metrics;
