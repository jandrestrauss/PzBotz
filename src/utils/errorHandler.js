const logger = require('./logger');

class ErrorHandler {
    constructor() {
        this.recoveryStrategies = new Map();
        this.errorCount = new Map();
        this.errorMap = new Map();
        this.setupDefaultStrategies();
        this.setupErrorHandlers();
    }

    setupDefaultStrategies() {
        this.addStrategy('NETWORK', async (error) => {
            await this.handleNetworkError(error);
        });

        this.addStrategy('DATABASE', async (error) => {
            await this.handleDatabaseError(error);
        });

        this.addStrategy('RATE_LIMIT', async (error) => {
            await this.handleRateLimitError(error);
        });
    }

    setupErrorHandlers() {
        process.on('uncaughtException', this.handleUncaughtException.bind(this));
        process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
    }

    async handleError(error, context = {}) {
        try {
            const errorType = this.classifyError(error);
            this.incrementErrorCount(errorType);

            const strategy = this.recoveryStrategies.get(errorType);
            if (strategy) {
                await strategy(error);
            }

            this.logError(error, context);
            await this.notifyIfCritical(errorType);
        } catch (handlingError) {
            logger.error('Error handler failed:', handlingError);
            throw handlingError;
        }
    }

    classifyError(error) {
        if (error.code?.startsWith('ENET')) return 'NETWORK';
        if (error.code?.startsWith('EDB')) return 'DATABASE';
        if (error.message?.includes('rate limit')) return 'RATE_LIMIT';
        return 'UNKNOWN';
    }

    incrementErrorCount(type) {
        const count = (this.errorCount.get(type) || 0) + 1;
        this.errorCount.set(type, count);
        
        if (count >= 5) {
            this.handleErrorThreshold(type);
        }
    }

    async handleErrorThreshold(type) {
        logger.warn(`Error threshold reached for ${type}`);
        // Implement threshold handling
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
