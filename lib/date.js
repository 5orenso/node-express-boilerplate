/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

/**
 * Module for date formatting.
 * @constructor
 * @param {hash} opt - Constructor options.
 */
function MyDate(opt) {
    this.opts = opt || {};
}

MyDate.prototype.isoDate = function isoDate(date) {
    // http://en.wikipedia.org/wiki/ISO_8601
    function pad(number) {
        let r = String(number);
        if (r.length === 1) {
            r = '0' + r;
        }
        return r;
    }

    let now;
    if (date) {
        now = new Date(0); // The 0 there is the key, which sets the date to the epoch
        now.setUTCSeconds(date);
    } else {
        now = new Date();
    }
    let mm = now.getMonth() + 1;
    let dd = now.getDate();
    let yy = now.getFullYear();
    let hh = now.getHours();
    let mi = now.getMinutes();
    let ss = now.getSeconds();
    let tzo = -now.getTimezoneOffset(),
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
