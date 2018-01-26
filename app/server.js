/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

/**
 * @fileOverview Loading config, mouting routes and starting http server.
 * See {@tutorial getting-started}
 * @name The main server.
 */
const commander = require('commander');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

commander
    .option('-c, --config <file>', 'configuration file path', './config/config-dist.js')
    .parse(process.argv);

// eslint-disable-next-line
const config = require(commander.config);

if (config) {
    const app = express();
    app.use(bodyParser.json());
    app.use(compression({
        threshold: 512,
    }));

    // eslint-disable-next-line
    let webRouter = require('./routes/web');
    webRouter.setConfig(config);

    // Routes
    // * Add more routes here
    app.use('/', webRouter);

    // Start the server -------------------------------
    const server = app.listen(config.app.port, () => {
        const serverAddress = server.address();
        const { address: host } = serverAddress;
        const { port } = serverAddress;
        console.log('info', `Something happens at http://${host}:${port}/`);
    });
}
