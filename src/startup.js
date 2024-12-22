const logger = require('./utils/logger');
const database = require('./database');
const serverHealth = require('./utils/serverHealth');
const taskManager = require('./scheduler/taskManager');

class StartupManager {
    async initialize() {
        try {
            logger.info('Starting PZBotV...');

            // Initialize database
            await database.sequelize.authenticate();
            await database.completeMigrationSystem();

            // Check system health
            const healthCheck = await serverHealth.checkSystem();
            if (healthCheck.alerts.length > 0) {
                logger.warn('System health warnings:', healthCheck.alerts);
            }

            // Initialize scheduled tasks
            taskManager.initialize();

            // Set up process handlers
            this.setupProcessHandlers();

            logger.info('PZBotV startup complete');
            return true;
        } catch (error) {
            logger.error('Startup failed:', error);
            return false;
        }
    }

    setupProcessHandlers() {
        process.on('SIGTERM', this.handleShutdown);
        process.on('SIGINT', this.handleShutdown);
        process.on('uncaughtException', this.handleError);
        process.on('unhandledRejection', this.handleError);
    }

    async handleShutdown() {
        logger.info('Shutting down...');
        await database.sequelize.close();
        process.exit(0);
    }

    handleError(error) {
        logger.error('Critical error:', error);
        process.exit(1);
    }
}

module.exports = new StartupManager();
