const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' })
    ]
});

const logEvent = (message) => {
    logger.info(message);
};

const error = (message, error) => {
    logger.log({
        level: 'error',
        message: `${message} ${error ? error.stack || error : ''}`
    });
};

module.exports = {
    logEvent,
    error
};
