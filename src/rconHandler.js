const Rcon = require('rcon');
const config = require('../config.json');

class RconHandler {
    constructor(config) {
        this.config = config;
        this.isConnected = false;
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    async connect() {
        try {
            this.rcon = new Rcon(
                config.rcon.host,
                config.rcon.port,
                config.rcon.password
            );

            await this.rcon.connect();
            this.isConnected = true;
            console.log('RCON connected');
            return true;
        } catch (error) {
            console.error('RCON connection failed:', error);
            this.isConnected = false;
            return false;
        }
    }

    async sendCommand(command, retryCount = 0) {
        try {
            // Input validation
            if (!command || typeof command !== 'string') {
                throw new Error('Invalid command format');
            }

            // Ensure connection
            if (!this.isConnected) {
                await this.connect();
            }

            // Send command
            const response = await this.rcon.send(command);
            return response;

        } catch (error) {
            if (retryCount < this.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.sendCommand(command, retryCount + 1);
            }
            throw new Error(`Failed to execute command after ${this.maxRetries} retries: ${error.message}`);
        }
    }
}