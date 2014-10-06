/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var myDate = function (opt, mock_services) {
    var opts = opt || {};
    mock_services = mock_services || {};

    return {
        iso_date: function (date) {
            // http://en.wikipedia.org/wiki/ISO_8601
            function pad (number, length) {
                var r = String(number);
                if (r.length < length) {
                    var diff_length = length - r.length;
                    for (var i = 0; i < diff_length; i++) {
                        r = '0' + r;
                    }
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
            var ms = now.getMilliseconds();
            var tzo = -now.getTimezoneOffset(),
                dif = tzo >= 0 ? '+' : '-';

            return pad(yy, 4) + '-' +
                pad(mm, 2) + '-' +
                pad(dd, 2) + 'T' +
                pad(hh, 2) + ':' +
                pad(mi, 2) + ':' +
                pad(ss, 2) + '.' +
                pad(ms, 3) +
                dif +
                pad(tzo / 60, 2) + ':' +
                pad(tzo % 60, 2);
        }
    };
};
module.exports = myDate;
