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
    app_path = path.normalize(__dirname + '/../');

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .parse(process.argv);
var config = require(app_path + commander.config);

var logger = require(app_path + 'lib/logger')({
    log_level : config.log_level
});

var app = express();
app.use(bodyParser.json());
app.use(compression({
    threshold: 512
}));

var web_router = require('./routes/web');
web_router.set_config(config, {});

app.use('/', web_router);

// Start the server -------------------------------
var server = app.listen(config.app.port);
logger.log('info', 'Something happens on port ' + config.app.port);
