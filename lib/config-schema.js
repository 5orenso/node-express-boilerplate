module.exports = {
    required: true,
    type: 'object',
    properties: {
        version: {required: false, type: 'string'},
        debug: {required: false, type: 'boolean'},
        logLevel: {required: true, type: 'string'},
        app: {required: true, type: 'object', properties: {
            port: {required: true, type: 'number'}
        }},
        useDataDog: {required: false, type: 'boolean'}
    },
    additionalProperties: false
};
