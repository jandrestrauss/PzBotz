const EventEmitter = require('events');
const logger = require('../utils/logger');
const { PerformanceMonitor } = require('../monitoring/performanceMonitor');
const ZomboidServer = require('../zomboid/server');
const DiscordBot = require('../discord/bot');
const WebSocketManager = require('../websocket/wsManager');
const DatabaseManager = require('../database/connectionManager');
const HealthCheck = require('./healthCheck');
const eventManager = require('../services/eventManager');
const monitoringService = require('../services/monitoringService');
const analyticsService = require('../services/analyticsService');
const webSocketServer = require('../services/webSocketServer');
const reportGenerator = require('../services/reportGenerator');
const jobScheduler = require('../services/jobScheduler');

class ApplicationManager extends EventEmitter {
    constructor() {
        super();
        this.services = new Map();
        this.isInitialized = false;
        this.performanceMonitor = new PerformanceMonitor();
        this.setupServices();
    }

    setupServices() {
        this.services.set('events', eventManager);
        this.services.set('monitoring', monitoringService);
        this.services.set('analytics', analyticsService);
        this.services.set('websocket', webSocketServer);
        this.services.set('reports', reportGenerator);
        this.services.set('jobs', jobScheduler);

        // Schedule daily report generation
        jobScheduler.schedule('dailyReport', '0 0 * * *', async () => {
            await reportGenerator.generateDailyReport();
        });
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

    async start() {
        logger.logEvent('Starting application services...');

        try {
            monitoringService.start();
            await webSocketServer.start();
            
            // Register event listeners
            eventManager.on('warning', (data) => {
                logger.warn('System warning:', data);
            });

            logger.logEvent('All services started successfully');
        } catch (error) {
            logger.error('Failed to start services:', error);
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

    async stop() {
        logger.logEvent('Stopping application services...');

        for (const [name, service] of this.services) {
            if (service.stop) {
                try {
                    await service.stop();
                    logger.logEvent(`Stopped service: ${name}`);
                } catch (error) {
                    logger.error(`Error stopping service ${name}:`, error);
                }
            }
        }
    }

    getService(name) {
        return this.services.get(name);
    }

    getStatus() {
        const status = {};
        for (const [name, service] of this.services) {
            status[name] = {
                running: !!service.isRunning,
                status: service.getStatus?.() || 'Unknown'
            };
        }
        return status;
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
