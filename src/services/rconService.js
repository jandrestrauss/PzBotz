const Rcon = require('modern-rcon');
const logger = require('../utils/logger');

class RconService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.connection = new Rcon(
                process.env.RCON_HOST,
                parseInt(process.env.RCON_PORT),
                process.env.RCON_PASSWORD
            );
            
            await this.connection.connect();
            this.isConnected = true;
            logger.info('RCON connected successfully');
        } catch (error) {
            logger.error('RCON connection failed:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async execute(command) {
        if (!this.isConnected) {
            await this.connect();
        }

        try {
            const response = await this.connection.send(command);
            logger.info(`RCON command executed: ${command}`);
            return response;
        } catch (error) {
            logger.error(`RCON command failed: ${command}`, error);
            this.isConnected = false;
            throw error;
        }
    }
}

module.exports = new RconService();
