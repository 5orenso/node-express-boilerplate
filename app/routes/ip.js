/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    morgan        = require('morgan'),
    fs            = require('fs'),
    path          = require('path'),
    _             = require('underscore'),
    maxmind       = require('maxmind'),
    appPath       = path.normalize(__dirname + '/../../'),
    maxmindDbPath = appPath + 'db',
    logger        = console.log,
    ApiUtil       = require(appPath + 'lib/api-util'),
    apiUtil       = new ApiUtil(),
    accessLogStream;

var ipRouter = express.Router();
ipRouter.setConfig = (conf, opt) => {
    ipRouter.config = conf;
    ipRouter.opt = opt;
    if (_.isObject(conf)) {
        if (_.isObject(conf.app) && _.isString(conf.app.logFile)) {
            accessLogStream = fs.createWriteStream(conf.app.logFile, {flags: 'a'});
            ipRouter.use(morgan('combined', {stream: accessLogStream}));
        }
    }
};

ipRouter.use((req, res, next) => {
    logger('info',
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

ipRouter.use(express.query()); // Parse queryString.
//app.use(Express.cookieParser(opt.cookie.secret)); // Parse cookies.

ipRouter.use('*', (req, res) => {
    var cityLookup = maxmind.open(maxmindDbPath + '/GeoLite2-City.mmdb');
    var ipRegExp = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
    var remoteIp = '';
    if (typeof req.query.q === 'string' && req.query.q.match(ipRegExp)) {
        remoteIp = req.query.q;
    } else if (typeof req.headers['x-forwarded-for'] === 'string' && req.headers['x-forwarded-for'].match(ipRegExp)) {
        remoteIp = req.headers['x-forwarded-for'];
        // jscs:disable
    } else if (typeof req.headers.remote_addr === 'string' && req.headers.remote_addr.match(ipRegExp)) {
        remoteIp = req.headers.remote_addr;
        // jscs:enable
    }
    var location = {
        location: {},
        postal: {},
        city: { names: {} },
        country: { names: {} },
        continent: { names: {} }
    };
    if (remoteIp.match(ipRegExp)) {
        location = cityLookup.get(remoteIp);
    }

    // console.log('LOCATION:', JSON.stringify(location, null, 4));
    // jscs:disable
    var responseLocation = {
        ip: req.headers.remote_addr,
        loc: (typeof location.location === 'object' ?
            (location.location.latitude + ',' + location.location.longitude) : ''),
        timezone: (typeof location.location === 'object' ? location.location.time_zone : ''),
        city: (typeof location.city === 'object' ? location.city.names.en : ''),
        postal: (typeof location.postal === 'object' ? location.postal.code : ''),
        continent: (typeof location.continent === 'object' ? location.continent.names.en : ''),
        continentCode: (typeof location.continent === 'object' ? location.continent.code : ''),
        country: (typeof location.country === 'object' ? location.country.names.en : ''),
        countryCode: (typeof location.country === 'object' ? location.country.iso_code : ''),
        poweredBy: 'http://www.maxmind.com'
    };
    // jscs:enable
    // Set cookies
    var cookieOptions = {
        expires: new Date(Date.now() + (86400 * 1000 * 1)),
        domain: ipRouter.config.app.domain,
        path: '/',
        secure: true
    };
    res.cookie('ip', responseLocation.ip, cookieOptions);
    res.cookie('cc', responseLocation.countryCode, cookieOptions);
    res.cookie('loc', responseLocation.loc, cookieOptions);
    res.cookie('continent', responseLocation.continent, cookieOptions);

    if (req.query.callback) {
        res.write(req.query.callback + '(' + JSON.stringify(responseLocation) + ')');
    } else {
        apiUtil.sendHeaderResponse(req, res, {
            httpStatusCode: 200,
            contentLength: responseLocation.length
        });
        res.write(JSON.stringify(responseLocation, null, 4));
    }
    res.end();
});

module.exports = ipRouter;

// Example usage inside a HTML page:
// Output:
///**/ typeof callback === 'function' && callback({
//    "ip": "89.9.250.109",
//    "hostname": "No Hostname",
//    "city": "",
//    "region": "",
//    "country": "NO",
//    "loc": "59.9500,10.7500",
//    "org": "AS12929 TeliaSonera Norge AS"
//});
// Usage:
//$(document).ready(function () {
//    $.getJSON("https://l2.io/ip.js?var=myip", function (data) {
//        console.log(data);
//        alert(data.ip);
//    });
//});
