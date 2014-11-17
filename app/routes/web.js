/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    morgan        = require('morgan'),
    when          = require('when'),
    _             = require('underscore'),
    swig          = require('swig'),
    fs            = require('fs'),
    path          = require('path'),
    app_path      = __dirname + '/../../',
    template_path = path.normalize(app_path + 'template/current'),
    logger        = require(app_path + 'lib/logger')();

var stats, activeConn, histogram, timer, config;
var web_router = express.Router();
web_router.set_config = function (conf, opt) {
    web_router.config = conf;
    web_router.opt = opt;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
    }
};

function redirectSlash (req, res, next) {
    if (req.url.match(/^\/$/)) {
        res.redirect(301, '/index.html');
    } else {
        next();
    }
}

web_router.use(express.query()); // Parse query_string.
//app.use(Express.cookieParser(opt.cookie.secret)); // Parse cookies.

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(app_path + '/logs/access.log', {flags: 'a'});
// setup the logger
web_router.use(morgan('combined', {stream: accessLogStream}));

web_router.use(function(req, res, next) {
    logger.log('info',
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

web_router.use(redirectSlash);
web_router.use('/js/', express.static(app_path + 'template/current/js/'));
web_router.use('/img/', express.static(app_path + 'template/current/img/'));
web_router.use('/css/', express.static(app_path + 'template/current/css/'));
web_router.use('/fonts/', express.static(app_path + 'template/current/fonts/'));
web_router.use('/favicon.ico', express.static(app_path + 'template/current/favicon.ico'));
web_router.use('/robots.txt', express.static(app_path + 'template/robots.txt'));
web_router.use('/sitemap.xml', express.static(app_path + 'template/sitemap.xml'));

// Main route for html files.
web_router.get('/*', function(req, res) {
    var request_pathname = req._parsedUrl.pathname;

    // Stop timer when response is transferred and finish.
    res.on('finish', function () {

    });
    // End metrics

    try {
        var tpl = swig.compileFile(template_path + request_pathname);
        res.send(tpl({
            title: 'Hello world',
            query_string: req.query,
        }));
    } catch (err) {
        res.status(404).send('Page not found: ' + err);
    }


});
module.exports = web_router;
