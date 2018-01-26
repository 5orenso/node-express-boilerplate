/*
* https://github.com/5orenso
*
* Copyright (c) 2018 Øistein Sørensen
* Licensed under the MIT license.
*/

'use strict';

const fs = require('fs');
const util = require('../../lib/utilities');
const Markdown = require('../../lib/markdown');

function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.toString());
        });
    });
}

module.exports = (req, res) => {
    readFile(`${__dirname}/../../README.md`)
        .then((fileContent) => {
            const body = Markdown.render(fileContent);
            util.renderPage(req, res, {
                title: 'Node Express Boilerplate',
                body,
            }, '/index.html');
        })
        .catch(err => util.renderError(req, res, err));
};
