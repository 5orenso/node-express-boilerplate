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
var path = require('path'),
    commander = require('commander'),
    express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    appPath = path.normalize(__dirname + '/../');

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .parse(process.argv);

var ConfigLoader = require(appPath + 'lib/config-loader');
var configLoader = new ConfigLoader();
var config = configLoader.load(commander.config);

if (config) {
    let app = express();
    app.use(bodyParser.json());
    app.use(compression({
        threshold: 512
    }));

    let apiRouter = require('./routes/api');
    apiRouter.setConfig(config);

    let ipRouter = require('./routes/ip');
    ipRouter.setConfig(config);

    let webRouter = require('./routes/web');
    webRouter.setConfig(config);

    // Routes
    // * Add more routes here
    app.use('/api/', apiRouter);
    app.use('/ip/', ipRouter);
    app.use('/', webRouter);

    // Start the server -------------------------------
    var server = app.listen(config.app.port, () => {
        let host = server.address().address;
        let port = server.address().port;
        console.log('info', 'Something happens at http://' + host + ':' + port + '/');
    });
}
