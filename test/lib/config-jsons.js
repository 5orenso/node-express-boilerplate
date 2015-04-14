// jscs:disable
module.exports = {
    valid: [
        {
            logLevel: 'info',
            app: {
                port: 8000
            }
        },
        {
            version: '1.0.0',
            logLevel: 'debug',
            app: {
                port: 8000
            }
        }
    ],
    //---------------------------------------------------------------------------------------------
    invalid: [
        {
            version: '2.1.0',
            log_level: 'info', // debug, verbose, info
            app: {
                port: 80
            }
        },
        {
            version: '1.0.0',
            app: { }
        }
    ]
};
