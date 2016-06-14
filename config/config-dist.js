module.exports = {
    version: '1.0.0',
    debug: true,
    logLevel: 'debug', // debug, verbose, info
    app: {
        port: 8000,
        logFile: '/tmp/access.log',
        domain: '.example.com'
    },
    useDataDog: true
};