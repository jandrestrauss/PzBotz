const DatabaseManager = require('../database/connectionManager');
const ZomboidServer = require('../zomboid/server');
const WebSocketManager = require('../websocket/wsManager');
const logger = require('../utils/logger');

const services = {
    database: DatabaseManager,
    server: ZomboidServer,
    websocket: WebSocketManager
};

async function restartService(serviceName) {
    const service = services[serviceName];
    if (!service) {
        throw new Error(`Service ${serviceName} not found`);
    }

    try {
        if (service.shutdown) {
            await service.shutdown();
        }
        if (service.start) {
            await service.start();
        }
        logger.info(`Service ${serviceName} restarted successfully`);
    } catch (error) {
        logger.error(`Failed to restart service ${serviceName}:`, error);
        throw error;
    }
}

module.exports = { restartService };
