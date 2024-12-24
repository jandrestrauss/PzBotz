const { exec } = require('child_process');
const logger = require('../utils/logger');
const path = require('path');

class AutoStartService {
    constructor() {
        this.checkInterval = null;
        this.enabled = false;
        this.serverBat = path.join(process.cwd(), 'server.bat');
    }

    start() {
        if (this.enabled) return;
        this.enabled = true;
        this.checkInterval = setInterval(() => this.checkServer(), 60000);
        logger.logEvent('Auto-start service enabled');
    }

    stop() {
        if (!this.enabled) return;
        this.enabled = false;
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        logger.logEvent('Auto-start service disabled');
    }

    async checkServer() {
        if (!this.enabled) return;

        try {
            const isRunning = await this.isServerRunning();
            if (!isRunning) {
                logger.logEvent('Server not running, attempting to start...');
                await this.startServer();
            }
        } catch (error) {
            logger.error('Error checking server status:', error);
        }
    }

    isServerRunning() {
        return new Promise((resolve) => {
            exec('tasklist /FI "IMAGENAME eq java.exe"', (error, stdout) => {
                resolve(!error && stdout.toLowerCase().includes('java.exe'));
            });
        });
    }

    startServer() {
        return new Promise((resolve, reject) => {
            exec(this.serverBat, (error) => {
                if (error) {
                    logger.error('Failed to start server:', error);
                    reject(error);
                } else {
                    logger.logEvent('Server started successfully');
                    resolve();
                }
            });
        });
    }
}

module.exports = new AutoStartService();
