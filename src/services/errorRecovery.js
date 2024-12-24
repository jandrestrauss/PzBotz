const EventEmitter = require('events');
const logger = require('../utils/logger');
const rconService = require('./rconService');
const { exec } = require('child_process');

class ErrorRecoveryService extends EventEmitter {
    constructor() {
        super();
        this.recoveryAttempts = new Map();
        this.maxAttempts = 3;
        this.recoveryTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async handleError(type, error) {
        logger.error(`Recovery triggered for ${type}:`, error);
        
        const attempts = this.recoveryAttempts.get(type) || 0;
        if (attempts >= this.maxAttempts) {
            this.emit('maxAttemptsReached', type);
            return false;
        }

        this.recoveryAttempts.set(type, attempts + 1);
        return await this.attemptRecovery(type);
    }

    async attemptRecovery(type) {
        switch (type) {
            case 'serverCrash':
                return await this.recoverFromCrash();
            case 'rconDisconnect':
                return await this.recoverRconConnection();
            case 'highMemory':
                return await this.performMemoryCleanup();
            default:
                logger.error(`Unknown recovery type: ${type}`);
                return false;
        }
    }

    async recoverFromCrash() {
        try {
            await this.restartServer();
            return true;
        } catch (error) {
            logger.error('Failed to recover from crash:', error);
            return false;
        }
    }

    async restartServer() {
        return new Promise((resolve, reject) => {
            exec('server.bat', (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    resetAttempts(type) {
        this.recoveryAttempts.delete(type);
    }
}

module.exports = new ErrorRecoveryService();
