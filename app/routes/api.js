/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    bodyParser    = require('body-parser'),
    morgan        = require('morgan'),
    fs            = require('fs'),
    _             = require('underscore-contrib'),
    appPath       = __dirname + '/../../',
    Logger        = require(appPath + 'lib/logger'),
    logger        = new Logger(),
    ApiUtil       = require(appPath + 'lib/api-util'),
    apiUtil       = new ApiUtil(),
    Metrics       = require(appPath + 'lib/metrics'),
    metrics       = new Metrics(),
    accessLogStream;

var counter = {
    requests: {
        200: 0, // OK
        201: 0, // Created
        202: 0, // Accepted, but not created yet
        304: 0, // Not modified
        400: 0, // Bad request
        401: 0, // Unauthorized
        402: 0, // Payment required
        403: 0, // Forbidden
        404: 0, // Not found
        409: 0, // Conflict
        418: 0, // I'm a teapot (RFC 2324)
        420: 0, // Enhance Your Calm
        500: 0, // Server error
        501: 0  // Not implemented
    }
};

var apiRouter = express.Router();
apiRouter.setConfig = function (conf, opt) {
    apiRouter.config = conf;
    apiRouter.opt = opt;
    if (_.isObject(opt)) {
        if (_.isNumber(opt.workerId)) {
            logger.set('workerId', opt.workerId);
        }
    }
    if (_.isObject(conf)) {
        metrics.set('useDataDog', conf.useDataDog);
        if (_.isObject(conf.app) && _.isString(conf.app.logFile)) {
            // create a write stream (in append mode)
            accessLogStream = fs.createWriteStream(conf.app.logFile, {flags: 'a'});
            // setup the logger
            apiRouter.use(morgan('combined', {stream: accessLogStream}));
        }
    }
};

apiRouter.use(function(req, res, next) {
    logger.log('info',
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

apiRouter.use(express.query()); // Parse queryString.
//app.use(Express.cookieParser(opt.cookie.secret)); // Parse cookies.

// Parse application/json
apiRouter.use(bodyParser.json());

// Handle errors from JSON input
apiRouter.use(function(err, req, res, next) {
    next();
});

// Handle browser lookups.
apiRouter.options('/*', function(req, res) {
    var httpStatusCode = 200;
    counter.requests[httpStatusCode]++;
    apiUtil.sendHeaderResponse(req, res, {
        httpStatusCode: httpStatusCode,
        contentLength: 2
    });
    res.write('OK');
    res.end();
});

// list/show object/s
apiRouter.get('/*', function(req, res) {
    res.metricsStart = metrics.start();
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        metrics.increment('node-express-boilerplate.count.route.get');
        metrics.timing('node-express-boilerplate.route.get', res.metricsStart);
    });
    // End metrics
    var apiRequest = apiUtil.parseApiRequest(req);
    var result = apiUtil.handleApiRequest(apiRequest);
    var httpStatusCode = result.httpStatusCode;
    counter.requests[httpStatusCode]++;
    apiUtil.sendJsonResponse(req, res, result);
});

// create new
apiRouter.post('/*', function(req, res) {
    res.metricsStart = metrics.start();
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        metrics.increment('node-express-boilerplate.count.route.post');
        metrics.timing('node-express-boilerplate.route.post', res.metricsStart);
    });
    // End metrics
    var apiRequest = apiUtil.parseApiRequest(req);
    var result = apiUtil.handleApiRequest(apiRequest);
    var httpStatusCode = result.httpStatusCode;
    counter.requests[httpStatusCode]++;
    apiUtil.sendJsonResponse(req, res, result);
});

// update all or one
apiRouter.put('/*', function(req, res) {
    res.metricsStart = metrics.start();
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        metrics.increment('node-express-boilerplate.count.route.put');
        metrics.timing('node-express-boilerplate.route.put', res.metricsStart);
    });
    // End metrics
    var apiRequest = apiUtil.parseApiRequest(req);
    var result = apiUtil.handleApiRequest(apiRequest);
    var httpStatusCode = result.httpStatusCode;
    counter.requests[httpStatusCode]++;
    apiUtil.sendJsonResponse(req, res, result);
});

// update all or one
apiRouter.patch('/*', function(req, res) {
    res.metricsStart = metrics.start();
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        metrics.increment('node-express-boilerplate.count.route.patch');
        metrics.timing('node-express-boilerplate.route.patch', res.metricsStart);
    });
    // End metrics
    var apiRequest = apiUtil.parseApiRequest(req);
    var result = apiUtil.handleApiRequest(apiRequest);
    var httpStatusCode = result.httpStatusCode;
    counter.requests[httpStatusCode]++;
    apiUtil.sendJsonResponse(req, res, result);
});

// delete all or one
apiRouter.delete('/*', function(req, res) {
    res.metricsStart = metrics.start();
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        metrics.increment('node-express-boilerplate.count.route.delete');
        metrics.timing('node-express-boilerplate.route.delete', res.metricsStart);
    });
    // End metrics
    var apiRequest = apiUtil.parseApiRequest(req);
    var result = apiUtil.handleApiRequest(apiRequest);
    var httpStatusCode = result.httpStatusCode;
    counter.requests[httpStatusCode]++;
    apiUtil.sendJsonResponse(req, res, result);
});

module.exports = apiRouter;

// jscs:disable
//# REST API endpoint basics
//
//Design basics of this Rest API. This CMS server is designed with best practise in mind. All endpoints follows these strict guidelines. Don't mix verb and nounce.
//
//| Resource           | POST create | GET read                | PUT/PATCH update             | DELETE
//|:-------------------|:------------|:------------------------|:-----------------------|:-----------
//| /api/article       | create new  | list all                | bulk update            | delete all
//| /api/article/123   | error       | show object with id=123 | if exists update this  | delete this
//
//
//## Endpoint basic examples for regular objects:
//
//    GET    /api/<objects>           List all objects.
//    GET    /api/<objects>/<id>      Get object with id = <id>.
//POST   /api/<objects>           Insert 1 or multiple new new objects.
//    POST   /api/<objects>/<id>      Error. Use PUT instead.
//    PUT    /api/<objects>           Bulk update objects.
//    PUT    /api/<objects>/<id>      Update this object.
//    DELETE /api/<objects>           Delete multiple objects.
//    DELETE /api/<objects>/<id>      Delete this object.
//
//
//## Endpoint basic examples for objects owned by other object:
//
//    GET    /api/<objects>/<id>/<sub-object>             List all sub-objects.
//    GET    /api/<objects>/<id>/<sub-object>/<id>        Get sub-object with id = <id>.
//# ...and then you get the pattern from the example above :)
