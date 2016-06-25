/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var _ = require('underscore-contrib'),
    apiHandlerModules = {};

// Load all api-handlers
var normalizedPath = require('path').join(__dirname, 'api-handlers');
require('fs').readdirSync(normalizedPath).forEach(function(file) {
    let moduleName = file.replace(/\.js$/, '');
    apiHandlerModules[moduleName] = require('./api-handlers/' + file);
    console.log('./api-handlers/' + file, moduleName, typeof apiHandlerModules[moduleName]);
});

var httpHeadersTemplate = {
    // Wildcard not allowed in combination with 'Access-Control-Allow-Credentials = true'
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Access-Control-Allow-Credentials': true,
    'Cache-Control': 'private, no-cache, proxy-revalidate, max-age=0',
    //'Content-Type': 'Content-Type: application/vnd.api+json; charset=utf-8'
    'Content-Type': 'application/json; charset=utf-8'
};

var responseTemplate = {
    //links: {},    // URLs related to the primary data.
    //meta: {},     // non-standard meta-information about the primary data.
    //included: {}, // a list of resource objects that are related to the primary
                  // data and/or each other ("included resources").
    data: {}      // Object or array of objects.
    //errors: []  // An array of errors.
};

/** Module for handling API requests.
 * @constructor
 * @param {hash} opt - Constructor options.
 * @property {string} [config] The config files.
 */
function ApiUtil(opt) {
    this.opts = opt || {};
}

/** Parse API request.
 * @param {object} req - Request object.
 * @property {string} [method] Request method.
 * @property {array} [params] URL parts.
 * @property {string} [query] Request query.
 * @property {string} [body] Request body.
 * @returns {object} requestObject - Parsed request object.
 */
ApiUtil.prototype.parseApiRequest = function parseApiRequest(req) {
    //console.log(req);
    var urlParts = req.params['0'].split('/');
    // articles / 123        / comments / 456       ? limit=10
    // resource / resourceId / related  / relatedId ? params
    return {
        method: req.method,
        resource: urlParts[0],
        resourceId: urlParts[1],
        related: urlParts[2],
        relatedId: urlParts[3],
        params: req.query,
        body: req.body
    };
};

/** Handle API request.
 * Try to find a function to handle this specific request.
 * All functions found in api-handlers.js module.
 *
 * Example: GET /articles/123            -> getArticles()
 *          GET /articles/123/comments/1 -> getArticlesComments()
 *
 * @param {object} apiRequest - API request object.
 * @property {string}  [resource] Resource type.
 * @property {integer} [resourceId] Resource Id.
 * @property {string}  [related] Related resource type.
 * @property {integer} [relatedId] Related resource Id.
 * @property {string}  [method] Request method.
 * @property {object}  [params] Query string object.
 * @property {string}  [body] Data from POST body.
 * @returns {*}
 */
ApiUtil.prototype.handleApiRequest = function handleApiRequest(apiRequest) {
    var result,
        resource = apiRequest.resource;
    var id = _.isEmpty(apiRequest.related) ? apiRequest.resourceId : apiRequest.relatedId;
    var functionName = apiRequest.method.toLowerCase() +
        apiRequest.resource.charAt(0).toUpperCase() +
        apiRequest.resource.slice(1);
    if (_.isString(apiRequest.related)) {
        functionName += apiRequest.related.charAt(0).toUpperCase() +
            apiRequest.related.slice(1);
    }
    // Dynamically include module based on api endpoint url.
    //if (typeof apiHandlers[functionName] === 'function') {
    if (typeof apiHandlerModules[resource] === 'object' &&
        typeof apiHandlerModules[resource][functionName] === 'function') {
        return apiHandlerModules[resource][functionName](id, {
            resource: apiRequest.resource,
            resourceId: apiRequest.resourceId,
            related: apiRequest.related,
            relatedId: apiRequest.relatedId,
            params: apiRequest.params,
            body: apiRequest.body
        });
    } else {
        return new Promise(function (resolve) {
            result = {
                httpStatusCode: 501,
                error: ApiUtil.prototype.makeErrorMsg({
                    developerMessage: 'Missing api-handlers function "' + 'api-handlers.' +
                    functionName + '(' + id + ', ' + JSON.stringify(apiRequest) + ')" to handle this request.',
                    userMessage: 'Endpoint not implemented.'
                })
            };
            resolve(result);
        });
    }
};

/** Send HTTP Header response
 * @param {object} req - Express request object
 * @param {object} res - Express response object.
 * @param {object} opt - Options for the response header.
 * @property {string}  [httpStatusCode] HTTP response code.
 * @property {string}  [contentLength] Length of content returned by the API handler.
 * @property {object}  [customHttpHeaders] Custom HTTP headers which is going to be appended to the response.
 * @returns {boolean}
 */
ApiUtil.prototype.sendHeaderResponse = function sendHeaderResponse(req, res, opt) {
    var httpHeaders = _.snapshot(httpHeadersTemplate);
    if (_.isString(req.headers.origin)) {
        httpHeaders['Access-Control-Allow-Origin'] = req.headers.origin;
    } else {
        delete httpHeaders['Access-Control-Allow-Credentials'];
    }
    if (_.isNumber(opt.contentLength)) {
        httpHeaders['Content-Length'] = opt.contentLength;
    }
    if (_.isObject(opt.customHttpHeaders)) {
        _.extend(httpHeaders, opt.customHttpHeaders);
    }
    res.writeHead(opt.httpStatusCode, httpHeaders);
    return true;
};

ApiUtil.prototype.makeErrorMsg = function makeErrorMsg(opt) {
    return {
        developerMessage: opt.developerMessage,
        userMessage: opt.userMessage,
        errorCode: opt.errorCode,
        moreInfo: opt.moreInfo
    };
};

ApiUtil.prototype.sendJsonResponse = function sendJsonResponse(req, res, opt) {
    var customHttpHeaders = {};
    var response = _.snapshot(responseTemplate);
    if (_.isObject(opt.data)) {
        response.data = opt.data;
    }
    if (_.isObject(opt.links)) {
        response.links = opt.links;
    }
    if (_.isObject(opt.meta)) {
        response.meta = opt.meta;
    }
    if (_.isObject(opt.included)) {
        response.included = opt.included;
    }
    if (_.isObject(opt.errors)) {
        response.errors = opt.errors;
    }
    if (_.isObject(opt.error)) {
        if (_.isArray(response.errors)) {
            response.errors.push(opt.error);
        } else {
            response.errors = [opt.error];
        }
    }
    if (_.isEmpty(response.errors)) {
        if (_.isObject(req.body.data)) {
            _.extend(response.data, req.body.data);
        }
    } else {
        delete response.data;
    }

    var statusJson = JSON.stringify(response, null, 4);
    if (opt.httpStatusCode === 204) {
        statusJson = {};
    }
    ApiUtil.prototype.sendHeaderResponse(req, res, {
        httpStatusCode: opt.httpStatusCode,
        contentLength: statusJson.length,
        customHttpHeaders: customHttpHeaders
    });
    res.write(statusJson);
    res.end();
    return true;
};

module.exports = ApiUtil;
