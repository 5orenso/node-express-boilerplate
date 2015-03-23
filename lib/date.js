/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when     = require('when'),
    _        = require('underscore'),
    appPath = __dirname + '/../';

function MyDate(opt, mockServices) {
    this.opts = opt || {};
    mockServices = mockServices || {};
}

MyDate.prototype.isoDate = function isoDate(date) {
    // http://en.wikipedia.org/wiki/ISO_8601
    function pad(number) {
        var r = String(number);
        if (r.length === 1) {
            r = '0' + r;
        }
        return r;
    }

    var now;
    if (date) {
        now = new Date(0); // The 0 there is the key, which sets the date to the epoch
        now.setUTCSeconds(date);
    } else {
        now = new Date();
    }
    var mm = now.getMonth() + 1;
    var dd = now.getDate();
    var yy = now.getFullYear();
    var hh = now.getHours();
    var mi = now.getMinutes();
    var ss = now.getSeconds();
    var tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-';

    return pad(yy) + '-' +
        pad(mm) + '-' +
        pad(dd) + 'T' +
        pad(hh) + ':' +
        pad(mi) + ':' +
        pad(ss) +
        dif +
        pad(tzo / 60) + ':' +
        pad(tzo % 60);
};
module.exports = MyDate;
