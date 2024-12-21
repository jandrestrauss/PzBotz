const mongoose = require('mongoose');
const logger = require('../utils/logger');

class DatabaseManager {
    constructor(config) {
        this.config = config;
        this.isConnected = false;
    }

    async connect() {
        try {
            await mongoose.connect(this.config.mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            this.isConnected = true;
            logger.info('Connected to database successfully');
        } catch (error) {
            logger.error('Database connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await mongoose.disconnect();
            this.isConnected = false;
            logger.info('Disconnected from database');
        }
    }

    getConnection() {
        return mongoose.connection;
    }

    async healthCheck() {
        if (!this.isConnected) return false;
        try {
            await mongoose.connection.db.admin().ping();
            return true;
        } catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        }
    }
}

module.exports = DatabaseManager;
