/*
* https://github.com/5orenso
*
* Copyright (c) 2018 Øistein Sørensen
* Licensed under the MIT license.
*/

'use strict';

const util = require('../../lib/utilities');

module.exports = (req, res) => {
    util.renderPage(req, res, {
        title: 'Node Express Boilerplate',
    });
};
