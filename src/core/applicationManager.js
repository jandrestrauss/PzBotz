const EventEmitter = require('events');
const logger = require('../utils/logger');
const { PerformanceMonitor } = require('../monitoring/performanceMonitor');
const ZomboidServer = require('../zomboid/serverManager');
const DiscordBot = require('../discord/bot');
const WebSocketManager = require('../websocket/wsManager');
const DatabaseManager = require('../database/connectionManager');
const HealthCheck = require('./healthCheck');

class ApplicationManager extends EventEmitter {
    constructor() {
        super();
        this.services = new Map();
        this.isInitialized = false;
        this.performanceMonitor = new PerformanceMonitor();
    }

    async initialize() {
        try {
            await DatabaseManager.connect();
            this.services.set('database', DatabaseManager);

            await ZomboidServer.start();
            this.services.set('server', ZomboidServer);

            await DiscordBot.start();
            this.services.set('discord', DiscordBot);

            const wsManager = new WebSocketManager();
            this.services.set('websocket', wsManager);

            this.setupErrorHandlers();
            this.isInitialized = true;
            logger.info('Application initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            throw error;
        }
    }

    async shutdown() {
        logger.info('Starting graceful shutdown...');
        for (const [name, service] of this.services) {
            try {
                if (service.shutdown) {
                    await service.shutdown();
                    logger.info(`Service ${name} shutdown successfully`);
                }
            } catch (error) {
                logger.error(`Error shutting down ${name}:`, error);
            }
        }
    }

    setupErrorHandlers() {
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            this.shutdown().then(() => process.exit(1));
        });

        process.on('unhandledRejection', (reason) => {
            logger.error('Unhandled Rejection:', reason);
            this.shutdown().then(() => process.exit(1));
        });
    }
}

module.exports = new ApplicationManager();
