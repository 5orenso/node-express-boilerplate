module.exports = {
    required: true,
    type: 'object',
    properties: {
        version: {required: false, type: 'string'},
        logLevel: {required: true, type: 'string'},
        app: {required: true, type: 'object', properties: {
            port: {required: true, type: 'number'}
        }}
    },
    additionalProperties: false
};
