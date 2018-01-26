/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2018 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const swig = require('swig');

const appPath = path.normalize(`${__dirname}/../`);
const templatePath = `${appPath}template/current`;

class Utilities {
    static renderPage(req, res, content, template) {
        // eslint-disable-next-line
        let requestPathname = template || req._parsedUrl.pathname;
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

    static renderError(req, res, err) {
        const errorMessage = `<center><h1>Something awful happend...</h1>
            A special force is looking into this right now!<br>
            <br>
            Please try again later...<br>
            <xmp>
               method: ${req.method}
               url: ${req.url}
               headers: ${req.headers}
            </xmp>

            Server Error (This should not be displayed to the users):
            <xmp>
               ${err}
            </xmp>
        </center>`;
        res.status(500).send(errorMessage);
    }
}
module.exports = Utilities;
