module.exports = {
    version: '1.0.0',
    logLevel: 'debug', // debug, verbose, info
    app: {
        port: 8000,
        logFile: '/tmp/access.log'
    },
    useDataDog: true
};