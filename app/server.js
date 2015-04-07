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
var config = require(appPath + commander.config);

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

app.use('/', webRouter);

// Start the server -------------------------------
var server = app.listen(config.app.port);
logger.log('debug', server);
logger.log('info', 'Something happens on port ' + config.app.port);
