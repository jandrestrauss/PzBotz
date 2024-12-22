const logger = require('./logger');

class ErrorHandler {
    constructor() {
        this.errorMap = new Map();
        this.setupErrorHandlers();
    }

    setupErrorHandlers() {
        process.on('uncaughtException', this.handleUncaughtException.bind(this));
        process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
    }

    handleError(error, source = 'unknown') {
        const errorId = Date.now().toString();
        this.errorMap.set(errorId, {
            error,
            timestamp: new Date(),
            source
        });

        logger.error({
            errorId,
            message: error.message,
            stack: error.stack,
            source
        });

        if (this.errorMap.size > 100) {
            const oldestKey = this.errorMap.keys().next().value;
            this.errorMap.delete(oldestKey);
        }

        return errorId;
    }

    async handleUncaughtException(error) {
        const errorId = this.handleError(error, 'uncaughtException');
        await logger.error(`Uncaught Exception (${errorId}):`, error);
        process.exit(1);
    }
}

module.exports = new ErrorHandler();
