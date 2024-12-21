const { Rcon } = require('rcon-client');
const logger = require('../utils/logger');

class RconHandler {
    constructor(config) {
        this.config = config || {
            host: process.env.RCON_HOST || '156.38.164.50',
            port: parseInt(process.env.RCON_PORT) || 27015,
            password: process.env.RCON_PASSWORD || 'Smart123'
        };
        this.connection = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.commandQueue = [];
    }

    async connect() {
        if (this.isConnected) return true;

        try {
            this.connection = new Rcon(this.config);
            await this.connection.connect();
            this.isConnected = true;
            this.reconnectAttempts = 0;
            logger.info('RCON connection established');
            
            this.connection.on('end', () => {
                this.handleDisconnect();
            });

            this.connection.on('error', (error) => {
                logger.error('RCON connection error:', error);
                this.handleDisconnect();
            });

            // Process any queued commands
            while (this.commandQueue.length > 0) {
                const { command, resolve, reject } = this.commandQueue.shift();
                try {
                    const response = await this.sendCommand(command);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            }

            return true;
        } catch (error) {
            logger.error('Failed to establish RCON connection:', error);
            return this.handleConnectionError(error);
        }
    }

    async handleDisconnect() {
        this.isConnected = false;
        this.connection = null;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
        } else {
            logger.error('Max reconnection attempts reached');
        }
    }

    async handleConnectionError(error) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            logger.info(`Connection failed, retrying (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            return new Promise(resolve => {
                setTimeout(async () => {
                    resolve(await this.connect());
                }, 5000 * this.reconnectAttempts);
            });
        }
        throw error;
    }

    async sendCommand(command) {
        if (!this.isConnected) {
            return new Promise((resolve, reject) => {
                this.commandQueue.push({ command, resolve, reject });
                this.connect().catch(reject);
            });
        }

        try {
            const response = await this.connection.send(command);
            return response;
        } catch (error) {
            logger.error(`Error executing command "${command}":`, error);
            throw error;
        }
    }

    async disconnect() {
        if (this.connection) {
            try {
                await this.connection.end();
                this.isConnected = false;
                this.connection = null;
                logger.info('RCON connection closed');
            } catch (error) {
                logger.error('Error disconnecting from RCON:', error);
            }
        }
    }
}

module.exports = RconHandler;
