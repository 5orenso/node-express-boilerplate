/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    morgan        = require('morgan'),
    swig          = require('swig'),
    fs            = require('fs'),
    path          = require('path'),
    _             = require('underscore'),
    appPath       = path.normalize(__dirname + '/../../'),
    templatePath  = appPath + 'template/current',
    logger        = console.log,
    accessLogStream;

var webRouter = express.Router();
webRouter.setConfig = (conf, opt) => {
    webRouter.config = conf;
    webRouter.opt = opt;
    if (_.isObject(conf)) {
        if (_.isObject(conf.app) && _.isString(conf.app.logFile)) {
            // create a write stream (in append mode) and setup the logger
            accessLogStream = fs.createWriteStream(conf.app.logFile, {flags: 'a'});
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

webRouter.use((req, res, next) => {
    logger('info',
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

// Main route for html files.
webRouter.get('/*', (req, res) => {
    var requestPathname = req._parsedUrl.pathname;
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
