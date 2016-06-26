/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

/**
 * Module for specific API requests.
 * @constructor
 * @param {hash} opt - Constructor options.
 */
function ApiHandlers(opt) {
    this.opts = opt || {};
}

// 200 OK
//   * A server MUST respond to a successful request to fetch an individual resource or
//     resource collection with a 200 OK response.
//   * A server MUST respond to a successful request to fetch a resource collection with
//     an array of resource objects or an empty array ([]) as the response document's primary data.
// 404 Not Found
//   * A server MUST return 404 Not Found when processing a request to fetch a relationship URL
//     that does not exist.
ApiHandlers.prototype.getPersons = function getPersons(id, opt, config) {
    return new Promise((resolve, reject) => {
        if (opt.debug) {
            console.log(__filename, opt, config);
        }
        if (opt.error) {
            reject(new Error(opt.error));
        }
        if (id) {
            resolve({
                httpStatusCode: 200,
                data: {
                    id: id,
                    title: 'Hello world',
                    links: {
                        self: 'http://example.com/persons/' + opt.resourceId,
                        author: {
                            self: 'http://example.com/persons/' + id + '/links/author',
                            related: 'http://example.com/persons/' + id + '/author',
                            linkage: {type: 'people', id: 9}
                        },
                        comments: {
                            self: 'http://example.com/persons/' + id + '/links/comments',
                            related: 'http://example.com/persons/' + id + '/comments',
                            linkage: [
                                {type: 'comments', id: 5},
                                {type: 'comments', id: 12}
                            ]
                        }
                    }
                },
                links: {},
                meta: {},
                included: {}
            });
        } else {
            resolve({
                httpStatusCode: 200,
                data: [{
                    id: 1234,
                    title: 'Hello world'
                }]
            });
        }
    });
};

ApiHandlers.prototype.getPersonsComments = function getPersonsComments(id, opt, config) {
    return new Promise((resolve) => {
        if (opt.debug) {
            console.log(__filename, opt, config);
        }
        resolve({
            httpStatusCode: 200,
            data: {
                id: id,
                links: {
                    self: opt.resourceId
                }
            }
        });
    });
};

// 201 Created
//   * A server MUST respond to a successful resource creation request according to HTTP semantics.
//     The response SHOULD include a Location header identifying the location of the newly created resource.
//     If a POST request did not include a Client-Generated ID, and a resource has been created,
//     the server MUST return a 201 Created status code.
//   * The response MUST also include a document that contains the primary resource created.
//     If the resource object returned by the response contains a self key in its links member,
//     the value of the self member MUST match the value of the Location header.
// 403 Forbidden
//   * A server MAY return 403 Forbidden in response to an unsupported request to create a resource.
//   * A server MUST return 409 Conflict when processing a POST request to create a resource with a
//     client-generated ID that already exists.
// 409 Conflict
//   * A server MUST return 409 Conflict when processing a POST request in which the resource's type
//     does not match the server's endpoint.
ApiHandlers.prototype.postPersons = function postPersons(id, opt, config) {
    return new Promise((resolve) => {
        if (opt.debug) {
            console.log(__filename, opt, config);
        }
        resolve({
            httpStatusCode: 201,
            data: {
                id: id,
                title: 'Hello world',
                links: {
                    self: 'http://example.com/persons/' + opt.resourceId
                }
            }
        });
    });
};

ApiHandlers.prototype.postPersonsComments = function postPersonsComments(id, opt, config) {
    return new Promise((resolve) => {
        if (opt.debug) {
            console.log(__filename, opt, config);
        }
        resolve({
            httpStatusCode: 201,
            data: {
                id: id,
                title: 'Hello world',
                links: {
                    self: 'http://example.com/persons/' + opt.resourceId
                }
            }
        });
    });
};

// http://jsonapi.org/format/#crud-updating-responses
// 204 No Content
//    A server MUST return a 204 No Content status code if an update is successful and the
//    client's current attributes remain up to date.
// 200 OK
//    If a server accepts an update but also changes the resource(s) in other ways than
//    those specified by the request (for example, updating the updated-at attribute or
//    a computed sha), it MUST return a 200 OK response.
//    The response document for a 200 OK MUST include a representation of the updated
//    resource(s) as if a GET request was made to the request URL.
// 403 Forbidden
//    A server MUST return 403 Forbidden in response to an unsupported request to update a
//    resource or relationship.
// 404 Not Found
//    A server MUST return 404 Not Found when processing a request to modify a resource
//    that does not exist.
//    A server MUST return 404 Not Found when processing a request that references a related
//    resource that does not exist.
// 409 Conflict
//    A server MAY return 409 Conflict when processing a PATCH request to update a resource
//    if that update would violate other server-enforced constraints (such as a uniqueness
//    constraint on a property other than id).
//    A server MUST return 409 Conflict when processing a PATCH request in which the resource's
//    type and id do not match the server's endpoint.
ApiHandlers.prototype.patchPersons = function patchPersons(id, opt, config) {
    return new Promise((resolve) => {
        if (opt.debug) {
            console.log(__filename, opt, config);
        }
        resolve({
            httpStatusCode: 200,
            data: {
                id: id,
                title: 'Hello world',
                links: {
                    self: 'http://example.com/persons/' + opt.resourceId
                }
            }
        });
    });
};
ApiHandlers.prototype.putPersons = ApiHandlers.prototype.patchPersons;

// http://jsonapi.org/format/#crud-deleting-responses
// 204 No Content
//    A server MUST return a 204 No Content status code if a delete request is successful.
// 403 Forbidden
//    A server MUST return 403 Forbidden in response to an unsupported request to update a relationship.
ApiHandlers.prototype.deletePersons = function deletePersons() {
    return new Promise((resolve) => {
        //if (opt) {
        //    console.log(__filename, 'ApiHandlers.prototype.deletePersons', opt);
        //}
        resolve({
            httpStatusCode: 204
        });
    });
};

// http://jsonapi.org/format/#crud-updating-relationship-responses-204
// 204 No Content
//    A server MUST return a 204 No Content status code if an update is successful and the
//    client's current attributes remain up to date.
//    Note: This is the appropriate response to a POST request sent to a to-many relationship
//    URL when that relationship already exists. It is also the appropriate response to a
//    DELETE request sent to a to-many relationship URL when that relationship does not exist.
// 403 Forbidden
//    A server MUST return 403 Forbidden in response to an unsupported request to update a relationship.
ApiHandlers.prototype.deletePersonsComments = function deletePersonsComments() {
    return new Promise((resolve) => {
        //if (opt) {
        //    console.log(__filename, opt);
        //}
        resolve({
            httpStatusCode: 204,
            data: {}
        });
    });
};

module.exports = new ApiHandlers();
