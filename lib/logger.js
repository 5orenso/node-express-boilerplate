/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when     = require('when'),
    winston  = require('winston'),
    syslog   = require('winston-syslog').Syslog,
    _        = require('underscore'),
    app_path = __dirname + '/../',
    hostname = require('os').hostname();

winston.add(winston.transports.Syslog, {
    facility: 'UDPlogger',
    app_name: 'UDPlogger',
    localhost: hostname
});
// host: '127.0.0.1', // The host running syslogd, defaults to localhost.
// port: 514,         // The port on the host that syslog is running on, defaults to syslogd's default port.
// protocol: 'udp4',  // The network protocol to log over (e.g. tcp4, udp4, etc).
// pid: PID of the process that log messages are coming from (Default process.pid).
// facility: Syslog facility to use (Default: local0).
// localhost: Host to indicate that log messages are coming from (Default: localhost).
// type: The type of the syslog protocol to use (Default: BSD).
// app_name: The name of the application (Default: process.title).

winston.setLevels(winston.config.syslog.levels);

var Logger = function (opt, mock_services) {
    var opts = opt || {};
    mock_services = mock_services || {};
    if (mock_services.logger) {
        winston = mock_services.logger;
    }

    function iso_date (date) {
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


    return {
        log: function () {
            var level = 'info';
            if (_.isObject(opts) && _.isObject(opts.log)) {
                if (_.isString(opts.log.level)) {
                    level = opts.log.level;
                }
                if (!opts.log.console) {
                    winston.remove(winston.transports.Console);
                }
            }
            if (arguments[0].match(/^(debug|info|notice|warning|error|crit|alert|emerg)$/)) {
                level = arguments[0];
                delete arguments[0];
            }
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
            return when.promise( function (resolve, reject) {
                //console.log(level, iso_date() + ' [' + (opts.workerId || '') + ']' + ': ' + msg.join(' -> '), meta);
                resolve(winston.log(level, iso_date() + ' [' + (opts.workerId || '') + ']' + ': ' + msg.join(' -> '), meta));
            });
        },

        err: function (message) {
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
            return when.promise( function (resolve, reject) {
                resolve(winston.log('error', iso_date() + ' [' + (opts.workerId || '') + ']' + ': ' + msg.join(' -> '), meta));
                // TODO: Should handle errors.
            });
        },

        iso_date: iso_date,

        set: function (key, value) {
            opts[key] = value;
            return true;
        },

        get: function (key) {
            return opts[key];
        }
    };
};
module.exports = Logger;
