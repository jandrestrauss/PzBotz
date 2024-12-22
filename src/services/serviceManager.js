const ZomboidServer = require('../zomboid/serverManager');
const DiscordBot = require('../discord/bot');
const Database = require('../database/database');
const logger = require('../utils/logger');

class ServiceManager {
    constructor() {
        this.services = new Map();
        this.initializeServices();
    }

    async initializeServices() {
        try {
            // Initialize core services
            await this.startService('database', new Database());
            await this.startService('server', new ZomboidServer());
            await this.startService('discord', new DiscordBot());
            
            logger.info('All services initialized successfully');
        } catch (error) {
            logger.error('Service initialization failed:', error);
            throw error;
        }
    }

    async startService(name, service) {
        try {
            await service.initialize();
            this.services.set(name, service);
            logger.info(`Service ${name} started successfully`);
        } catch (error) {
            logger.error(`Failed to start service ${name}:`, error);
            throw error;
        }
    }
}

module.exports = new ServiceManager();
