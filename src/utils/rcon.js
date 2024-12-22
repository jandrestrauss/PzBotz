const Rcon = require('rcon');
const logger = require('./logger');
require('dotenv').config();

class RconManager {
    constructor() {
        this.connection = null;
        this.config = {
            host: process.env.RCON_HOST || 'localhost',
            port: parseInt(process.env.RCON_PORT) || 27015,
            password: process.env.RCON_PASSWORD
        };
    }

    async connect() {
        try {
            this.connection = new Rcon(
                this.config.host,
                this.config.port,
                this.config.password
            );
            await this.connection.connect();
            logger.info('RCON connected successfully');
        } catch (error) {
            logger.error('RCON connection failed:', error);
            throw error;
        }
    }

    async sendCommand(command) {
        if (!this.connection) await this.connect();
        try {
            const response = await this.connection.send(command);
            logger.debug(`RCON command executed: ${command}`);
            return response;
        } catch (error) {
            logger.error(`RCON command failed: ${command}`, error);
            throw error;
        }
    }
}

module.exports = new RconManager();