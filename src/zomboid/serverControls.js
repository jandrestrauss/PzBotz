const path = require('path');
const { spawn } = require('child_process');
const logger = require('../utils/logger');
const { PerformanceMonitor } = require('../utils/performance');

class ServerControls {
    constructor() {
        this.process = null;
        this.startupAttempts = 0;
        this.maxStartupAttempts = 3;
    }

    async startServer() {
        const stopTimer = PerformanceMonitor.startTimer('serverStart');
        try {
            if (this.startupAttempts >= this.maxStartupAttempts) {
                throw new Error('Max startup attempts reached');
            }

            const serverPath = path.join(process.env.ZOMBOID_SERVER_PATH, 'StartServer64.bat');
            this.process = spawn(serverPath, [], {
                cwd: process.env.ZOMBOID_SERVER_PATH
            });

            this.setupProcessHandlers();
            this.startupAttempts++;
            logger.logEvent('Server starting...');
        } finally {
            stopTimer();
        }
    }

    async stopServer() {
        if (!this.process) return;
        
        try {
            this.process.kill();
            logger.logEvent('Server stopped');
        } catch (error) {
            logger.logEvent(`Error stopping server: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new ServerControls();
