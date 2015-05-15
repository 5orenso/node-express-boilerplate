/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster = require('buster'),
    assert = buster.assert,
    appPath = __dirname + '/../../';

var req = {
    body: {
        data: {}
    },
    params: { 0: 'articles/1' },
    method: 'GET',
    query: { foo: 'bar' },
    headers: {
        origin: 'http://example.com/'
    }
};
var res = {
    writeHead: function () {},
    write: function () {},
    end: function () {}
};

buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
        delete require.cache[require.resolve(appPath + 'lib/api-util')];
    },
    'Test api-util:': {
        'call parseApiRequest': function () {
            var Au = require(appPath + 'lib/api-util');
            var au  = new Au();
            var result = au.parseApiRequest({
                params: { 0: 'articles/1' },
                method: 'GET',
                query: { foo: 'bar' }
            });
            //console.log(result);
            // TODO: Check response and compare.
            assert(result);
        },
        'call handleApiRequest for resource': function () {
            var Au = require(appPath + 'lib/api-util');
            var au  = new Au();
            var result = au.parseApiRequest({
                params: { 0: 'articles/1' },
                method: 'GET',
                query: { foo: 'bar' }
            });
            var apiResult = au.handleApiRequest(result);
            //console.log(apiResult);
            // TODO: Check response and compare.
            assert(apiResult);
        },
        'call handleApiRequest for related': function () {
            var Au = require(appPath + 'lib/api-util');
            var au  = new Au();
            var result = au.parseApiRequest({
                params: { 0: 'articles/1/author' },
                method: 'GET',
                query: { foo: 'bar' }
            });
            var apiResult = au.handleApiRequest(result);
            //console.log(apiResult);
            // TODO: Check response and compare.
            assert(apiResult);
        },
        'call sendHeaderResponse': function () {
            var Au = require(appPath + 'lib/api-util');
            var au  = new Au();
            var result = au.sendHeaderResponse(req, res, {
                httpStatusCode: 200,
                contentLength: 1024,
                customHttpHeaders: {
                    location: 'http://example.com/articles/1'
                }
            });
            //console.log(result);
            // TODO: Check response and compare.
            assert(result);
        },
        'call makeErrorMsg': function () {
            var Au = require(appPath + 'lib/api-util');
            var au  = new Au();
            var result = au.makeErrorMsg({
                developerMessage: 'dev message',
                userMessage: 'user message'
            });
            //console.log(result);
            // TODO: Check response and compare.
            assert(result);
        },
        'call sendJsonResponse with success': function () {
            var Au = require(appPath + 'lib/api-util');
            var au  = new Au();
            var result = au.parseApiRequest({
                params: { 0: 'articles/1' },
                method: 'GET',
                query: { foo: 'bar' }
            });
            var apiResult = au.handleApiRequest(result);
            var sendResult = au.sendJsonResponse(req, res, apiResult);
            //console.log(sendResult);
            // TODO: Check response and compare.
            assert(sendResult);
        },
        'call sendJsonResponse with error': function () {
            var Au = require(appPath + 'lib/api-util');
            var au  = new Au();
            var result = au.parseApiRequest({
                params: { 0: 'non-existing-endpoint/1' },
                method: 'GET',
                query: { foo: 'bar' }
            });
            var apiResult = au.handleApiRequest(result);
            au.sendJsonResponse(req, res, apiResult);
            apiResult.errors = [];
            au.sendJsonResponse(req, res, apiResult);
            // TODO: Check response and compare.
            assert(true);
        }

    }
});
