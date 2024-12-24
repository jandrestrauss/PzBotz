const { exec } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

class ServerAutoStartService {
    constructor() {
        this.isEnabled = false;
        this.checkInterval = null;
    }

    start() {
        if (this.checkInterval) return;
        
        this.checkInterval = setInterval(() => this.checkServer(), 60000);
        this.isEnabled = true;
        logger.info('Server auto-start service enabled');
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        this.isEnabled = false;
        logger.info('Server auto-start service disabled');
    }

    async checkServer() {
        if (!this.isEnabled) return;

        try {
            const isRunning = await this.isServerRunning();
            if (!isRunning) {
                logger.info('Server is not running, attempting to start...');
                await this.startServer();
            }
        } catch (error) {
            logger.error('Error checking server status:', error);
        }
    }

    isServerRunning() {
        return new Promise((resolve) => {
            exec('tasklist /FI "IMAGENAME eq java.exe"', (error, stdout) => {
                resolve(stdout.toLowerCase().includes('java.exe'));
            });
        });
    }

    startServer() {
        return new Promise((resolve, reject) => {
            const serverBat = path.join(process.cwd(), 'server.bat');
            exec(serverBat, (error) => {
                if (error) {
                    logger.error('Failed to start server:', error);
                    reject(error);
                } else {
                    logger.info('Server started successfully');
                    resolve();
                }
            });
        });
    }
}

module.exports = new ServerAutoStartService();
