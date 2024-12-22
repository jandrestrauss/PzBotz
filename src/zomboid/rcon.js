const Rcon = require('rcon');
const logger = require('../utils/logger');

class RconHandler {
    constructor() {
        this.connection = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async connect() {
        try {
            this.connection = new Rcon(
                process.env.SERVER_IP,
                parseInt(process.env.RCON_PORT),
                process.env.RCON_PASSWORD
            );

            await this.connection.connect();
            this.connected = true;
            this.reconnectAttempts = 0;
            logger.logEvent('RCON connected successfully');
        } catch (error) {
            logger.logEvent(`RCON connection failed: ${error.message}`);
            await this.handleConnectionError();
        }
    }

    async executeCommand(command) {
        if (!this.connected) {
            await this.connect();
        }
        try {
            const response = await this.connection.send(command);
            return this.parseResponse(response);
        } catch (error) {
            logger.logEvent(`RCON command error: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new RconHandler();
