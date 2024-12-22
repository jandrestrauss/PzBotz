const { healthCheck } = require('./healthCheck');
const logger = require('../utils/logger');
const SystemMonitor = require('./systemMonitor');
const validator = require('./validation');

class Bootstrap {
    constructor() {
        this.initOrder = [
            'database',
            'cache',
            'server',
            'discord',
            'websocket'
        ];
    }

    async start() {
        try {
            // Validate environment
            this.validateEnvironment();

            // Initialize services in order
            for (const service of this.initOrder) {
                await this.initializeService(service);
            }

            // Start monitoring
            this.startMonitoring();

            logger.info('Application started successfully');
        } catch (error) {
            logger.error('Bootstrap failed:', error);
            process.exit(1);
        }
    }

    validateEnvironment() {
        const requiredEnv = [
            'DISCORD_TOKEN',
            'ZOMBOID_SERVER_PATH',
            'DB_CONNECTION_STRING',
            'JWT_SECRET'
        ];

        const missing = requiredEnv.filter(env => !process.env[env]);
        if (missing.length > 0) {
            throw new Error(`Missing environment variables: ${missing.join(', ')}`);
        }
    }
}

module.exports = new Bootstrap();
