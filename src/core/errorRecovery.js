const logger = require('../utils/logger');
const { restartService } = require('./serviceManager');

class ErrorRecovery {
    constructor() {
        this.setupErrorHandlers();
    }

    setupErrorHandlers() {
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            this.handleCriticalError(error);
        });

        process.on('unhandledRejection', (reason) => {
            logger.error('Unhandled Rejection:', reason);
            this.handleCriticalError(reason);
        });
    }

    async handleCriticalError(error) {
        try {
            // Attempt to restart critical services
            await restartService('database');
            await restartService('server');
            await restartService('websocket');
            logger.info('Critical services restarted successfully');
        } catch (restartError) {
            logger.error('Failed to restart critical services:', restartError);
            process.exit(1);
        }
    }
}

module.exports = new ErrorRecovery();
