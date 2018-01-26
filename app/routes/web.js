/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const swig = require('swig');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const marked = require('marked');

const appPath = path.normalize(`${__dirname}/../../`);
const templatePath = `${appPath}template/current`;
const logger = console.log;
const renderer = new marked.Renderer();

let accessLogStream;

// Markdown settings
marked.setOptions({
    highlight(code) {
        // eslint-disable-next-line
        return require('highlight.js').highlightAuto(code).value;
    },
});
renderer.heading = function heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} class="toc-${level}"><a name="${
        escapedText
    }" class="anchor" href="#${
        escapedText
    }"><span class="header-link"></span></a>${
        text}</h${level}>`;
};
// <a href="#" id="pop">
//     <img id="imageresource" src="http://patyshibuya.com.br/wp-content/uploads/2014/04/04.jpg"
//         style="width: 400px; height: 264px;">
//     Click to Enlarge
// </a>
renderer.image = function image($href, title, text) {
    const src = $href;
    const href = $href.replace(/(w=[0-9]+)/, 'w=1800');
    const mediaClass = [];
    const result = src.match(/#([a-z,]+)$/);
    if (result) {
        const allClasses = result[1].split(',');
        for (let i = 0, l = allClasses.length; i < l; i += 1) {
            mediaClass.push(allClasses[i]);
        }
    }
    return `<p class="image_inline ${mediaClass.join(' ')}"><a href="${href}" data-smoothzoom="group1" title="${title
        || text}"><img src="${src}" alt="${text}" title="${title || text}">` +
        `</a><span class="image_inline_text">${title || text}</span></p>`;
};
// /Markdown settings

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

webRouter.use(express.query()); // Parse queryString.
webRouter.use(cookieParser()); // Parse cookies.

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

function renderPage(req, res, content) {
    // eslint-disable-next-line
    let requestPathname = req._parsedUrl.pathname;
    try {
        const tpl = swig.compileFile(templatePath + requestPathname);
        res.send(tpl(Object.assign({
            cookies: req.cookies,
            signedCookies: req.signedCookies,
            queryString: req.query,
            requestHeaders: req.headers,
        }, content)));
    } catch (err) {
        res.status(404).send(`Page not found: ${err}`);
    }
}

// Main route for html files.
webRouter.get('/*', (req, res) => {
    fs.readFile(`${__dirname}/../../README.md`, (err, data) => {
        if (err) {
            throw err;
        }
        // console.log(data.toString());
        const body = marked(data.toString(), { renderer });
        renderPage(req, res, {
            title: 'Node Express Boilerplate',
            body,
        });
    });
});
module.exports = webRouter;
