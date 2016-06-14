/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    morgan        = require('morgan'),
    swig          = require('swig'),
    fs            = require('fs'),
    path          = require('path'),
    _             = require('underscore'),
    maxmind       = require('maxmind'),
    appPath       = __dirname + '/../../',
    maxmindDbPath = path.normalize(appPath + 'db'),
    templatePath  = path.normalize(appPath + 'template/current'),
    Logger        = require(appPath + 'lib/logger'),
    logger        = new Logger(),
    ApiUtil       = require(appPath + 'lib/api-util'),
    apiUtil       = new ApiUtil(),
    accessLogStream;

var webRouter = express.Router();
webRouter.setConfig = function (conf, opt) {
    webRouter.config = conf;
    webRouter.opt = opt;
    if (_.isObject(opt)) {
        if (_.isNumber(opt.workerId)) {
            logger.set('workerId', opt.workerId);
        }
    }
    if (_.isObject(conf)) {
        if (_.isObject(conf.app) && _.isString(conf.app.logFile)) {
            // create a write stream (in append mode)
            accessLogStream = fs.createWriteStream(conf.app.logFile, {flags: 'a'});
            // setup the logger
            webRouter.use(morgan('combined', {stream: accessLogStream}));
        }
    }
};

function redirectSlash(req, res, next) {
    if (req.url.match(/^\/(\?\w+=.+?)*$/)) {
        res.redirect(301, '/index.html');
    } else {
        next();
    }
}

webRouter.use(express.query()); // Parse queryString.
//app.use(Express.cookieParser(opt.cookie.secret)); // Parse cookies.

webRouter.use(function(req, res, next) {
    logger.log('info',
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

webRouter.use(redirectSlash);
webRouter.use('/js/', express.static(appPath + 'template/current/js/'));
webRouter.use('/img/', express.static(appPath + 'template/current/img/'));
webRouter.use('/css/', express.static(appPath + 'template/current/css/'));
webRouter.use('/fonts/', express.static(appPath + 'template/current/fonts/'));
webRouter.use('/favicon.ico', express.static(appPath + 'template/current/favicon.ico'));
webRouter.use('/robots.txt', express.static(appPath + 'template/robots.txt'));
webRouter.use('/sitemap.xml', express.static(appPath + 'template/sitemap.xml'));

webRouter.use('/ip', function (req, res) {
    // jscs:disable
    var cityLookup = maxmind.open(maxmindDbPath + '/GeoLite2-City.mmdb');
    var ipRegExp = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
    var remoteIp = '';
    if (typeof req.query.q === 'string' && req.query.q.match(ipRegExp)) {
        remoteIp = req.query.q;
    } else if (typeof req.headers['x-forwarded-for'] === 'string' && req.headers['x-forwarded-for'].match(ipRegExp)) {
        remoteIp = req.headers['x-forwarded-for'];
    } else if (typeof req.headers.remote_addr === 'string' && req.headers.remote_addr.match(ipRegExp)) {
        remoteIp = req.headers.remote_addr;
    }
    var location = {
        location: {},
        postal: {},
        city: {},
        country: {},
        continent: {}
    };
    if (remoteIp.match(ipRegExp)) {
        location = cityLookup.get(remoteIp);
    }

    // console.log('LOCATION:', JSON.stringify(location, null, 4));
    var responseLocation = {
        ip: req.headers.remote_addr,
        loc: (typeof location.location === 'object' ? (location.location.latitude + ',' + location.location.longitude) : ''),
        timezone: (typeof location.location === 'object' ? location.location.time_zone : ''),
        city: (typeof location.city === 'object' ? location.city.names.en : ''),
        postal: (typeof location.postal === 'object' ? location.postal.code : ''),
        continent: (typeof location.continent === 'object' ? location.continent.names.en : ''),
        continentCode: (typeof location.continent === 'object' ? location.continent.code : ''),
        country: (typeof location.country === 'object' ? location.country.names.en : ''),
        countryCode: (typeof location.country === 'object' ? location.country.iso_code : ''),
        poweredBy: 'http://www.maxmind.com'
    };
    if (req.query.callback) {
        res.write(req.query.callback + '(' + JSON.stringify(responseLocation) + ')');
    } else {
        apiUtil.sendHeaderResponse(req, res, {
            httpStatusCode: 200,
            contentLength: responseLocation.length
        });
        res.write(JSON.stringify(responseLocation, null, 4));
    }
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
    // jscs:enable
    res.end();
});

// Main route for html files.
webRouter.get('/*', function(req, res) {
    var requestPathname = req._parsedUrl.pathname;

    // Stop timer when response is transferred and finish.
    res.on('finish', function () {

    });

    // End metrics
    //console.log(req.headers);
    try {
        var tpl = swig.compileFile(templatePath + requestPathname);
        res.send(tpl({
            title: 'Hello world',
            queryString: req.query,
            requestHeaders: req.headers
        }));
    } catch (err) {
        res.status(404).send('Page not found: ' + err);
    }

});
module.exports = webRouter;
