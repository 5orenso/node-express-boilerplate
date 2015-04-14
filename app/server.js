/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

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
var config = configLoader.load(appPath + commander.config);

if (config) {
    var Logger = require(appPath + 'lib/logger');
    var logger = new Logger({
        logLevel: config.logLevel
    });

    var app = express();
    app.use(bodyParser.json());
    app.use(compression({
        threshold: 512
    }));

    var webRouter = require('./routes/web');
    webRouter.setConfig(config, {});

    // Routes
    // * Add more routes here
    app.use('/', webRouter);

    // Start the server -------------------------------
    var server = app.listen(config.app.port, function () {
        var host = server.address().address;
        var port = server.address().port;
        logger.log('info', 'Something happens at http://' + host + ':' + port + '/');
    });
}
