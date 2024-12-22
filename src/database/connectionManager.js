const mongoose = require('mongoose');
const logger = require('../utils/logger');

class DatabaseManager {
    constructor() {
        this.retryAttempts = 0;
        this.maxRetries = 5;
        this.retryDelay = 5000;
        this.isConnected = false;
    }

    async connect() {
        try {
            await mongoose.connect(process.env.DB_CONNECTION_STRING, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                heartbeatFrequencyMS: 30000
            });

            this.isConnected = true;
            this.retryAttempts = 0;
            logger.info('Database connected successfully');
            
            this.setupConnectionHandlers();
        } catch (error) {
            await this.handleConnectionError(error);
        }
    }

    async shutdown() {
        if (this.isConnected) {
            await mongoose.disconnect();
            this.isConnected = false;
            logger.info('Database disconnected successfully');
        }
    }

    setupConnectionHandlers() {
        mongoose.connection.on('disconnected', () => {
            this.isConnected = false;
            logger.warn('Database disconnected');
            this.reconnect();
        });

        mongoose.connection.on('error', (error) => {
            logger.error('Database error:', error);
            if (!this.isConnected) {
                this.reconnect();
            }
        });
    }

    async reconnect() {
        if (this.retryAttempts >= this.maxRetries) {
            logger.error('Max retry attempts reached. Could not reconnect to the database.');
            return;
        }

        this.retryAttempts++;
        logger.info(`Retrying database connection (${this.retryAttempts}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        await this.connect();
    }

    async handleConnectionError(error) {
        logger.error('Database connection error:', error);
        await this.reconnect();
    }
}

module.exports = new DatabaseManager();
