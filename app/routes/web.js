/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// const swig = require('swig');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
// const Markdown = require('../../lib/markdown');

const appPath = path.normalize(`${__dirname}/../../`);
// const templatePath = `${appPath}template/current`;
const logger = console.log;

let accessLogStream;

const webRouter = express.Router();

webRouter.setConfig = (conf, opt) => {
    webRouter.config = conf;
    webRouter.opt = opt;
    if (_.isObject(conf)) {
        if (_.isObject(conf.app) && _.isString(conf.app.logFile)) {
            // create a write stream (in append mode) and setup the logger
            accessLogStream = fs.createWriteStream(conf.app.logFile, { flags: 'a' });
            webRouter.use(morgan('combined', { stream: accessLogStream }));
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

webRouter.use(compression());
webRouter.use(bodyParser.urlencoded({
    extended: true,
}));
webRouter.use(bodyParser.json());
webRouter.use(express.query()); // Parse queryString.
webRouter.use(cookieParser()); // Parse cookies.
webRouter.use(useragent.express()); // Parse useragent

webRouter.use((req, res, next) => {
    logger('info', req.method, req.url, req.get('Content-type'), req.get('User-agent'));
    next(); // make sure we go to the next routes and don't stop here
});

webRouter.use(redirectSlash);
webRouter.use('/js/', express.static(`${appPath}template/current/js/`));
webRouter.use('/img/', express.static(`${appPath}template/current/img/`));
webRouter.use('/css/', express.static(`${appPath}template/current/css/`));
webRouter.use('/fonts/', express.static(`${appPath}template/current/fonts/`));
webRouter.use('/favicon.ico', express.static(`${appPath}template/current/favicon.ico`));
webRouter.use('/robots.txt', express.static(`${appPath}template/robots.txt`));
webRouter.use('/sitemap.xml', express.static(`${appPath}template/sitemap.xml`));

// All /examples/* will be sent to this new route
webRouter.use('/example/', require('./examples/'));

// /readme will be sent to get-markdown.js handler.
webRouter.get('/readme', require('./get-markdown.js'));
// All other will be sent to this handler.
webRouter.get('/*', require('./get-html.js'));

module.exports = webRouter;
