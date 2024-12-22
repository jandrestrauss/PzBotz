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
}

module.exports = new DatabaseManager();
