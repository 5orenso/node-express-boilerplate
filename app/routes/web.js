/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    when          = require('when'),
    _             = require('underscore'),
    swig          = require('swig'),
    fs            = require('fs'),
    path          = require('path'),
    app_path      = __dirname + '/../../',
    template_path = path.normalize(app_path + 'template/current/'),
    content_path  = path.normalize(app_path + 'content/articles/'),
    logger        = require(app_path + 'lib/logger')();

var config;
var web_router = express.Router();
web_router.set_config = function (conf, opt) {
    web_router.config = conf;
    web_router.opt = opt;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('content_path')) {
            content_path = path.normalize(opt.content_path);
        }
    }
};

web_router.use(function(req, res, next) {
    logger.log('info',
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

web_router.use('/', express.static(app_path + 'template/current/index.html'));
web_router.use('/index.html', express.static(app_path + 'template/current/index.html'));

web_router.use('/js/', express.static(app_path + 'template/current/js/'));
web_router.use('/img/', express.static(app_path + 'template/current/img/'));
web_router.use('/css/', express.static(app_path + 'template/current/css/'));
web_router.use('/fonts/', express.static(app_path + 'template/current/fonts/'));
web_router.use('/favicon.ico', express.static(app_path + 'template/current/favicon.ico'));
web_router.use('/robots.txt', express.static(app_path + 'template/robots.txt'));
web_router.use('/sitemap.xml', express.static(app_path + 'template/sitemap.xml'));

// Main route for blog articles.
web_router.get('/*', function(req, res) {
    res.status(404).send('Page not found');
});
module.exports = web_router;
