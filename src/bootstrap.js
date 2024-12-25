const logger = require('./utils/logger');
const serviceIntegrator = require('./core/serviceIntegrator');
const errorHandler = require('./utils/errorHandler');
const performanceMonitor = require('./monitoring/performanceMonitor');

class ApplicationBootstrap {
    static async init() {
        try {
            // Initialize core services
            await serviceIntegrator.start();
            
            // Start monitoring
            performanceMonitor.startMonitoring();

            // Setup global error handlers
            process.on('uncaughtException', err => errorHandler.handleError(err));
            process.on('unhandledRejection', err => errorHandler.handleError(err));

            logger.info('Application initialized successfully');
            return true;
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            return false;
        }
    }

    static async shutdown() {
        try {
            await serviceIntegrator.stop();
            performanceMonitor.stop();
            logger.info('Application shutdown complete');
        } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
        }
    }
}

module.exports = ApplicationBootstrap;
