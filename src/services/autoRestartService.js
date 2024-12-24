const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const rconService = require('./rconService');
const { exec } = require('child_process');

class AutoRestartService {
    constructor() {
        this.configPath = path.join(__dirname, '../../config/restart.txt');
        this.checkInterval = null;
    }

    start() {
        this.checkInterval = setInterval(() => this.checkRestartTime(), 60000);
        logger.info('Auto restart service started');
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        logger.info('Auto restart service stopped');
    }

    async checkRestartTime() {
        if (!fs.existsSync(this.configPath)) return;

        const scheduledTime = new Date(fs.readFileSync(this.configPath, 'utf8'));
        const now = new Date();

        if (now >= scheduledTime) {
            await this.performRestart();
            this.updateNextRestartTime();
        }
    }

    async performRestart() {
        try {
            await rconService.execute('servermsg "Server restart in 5 minutes"');
            setTimeout(async () => {
                await rconService.execute('quit');
                setTimeout(() => {
                    exec('server.bat', { cwd: process.cwd() });
                }, 5000);
            }, 300000); // 5 minutes
        } catch (error) {
            logger.error('Auto restart failed:', error);
        }
    }

    updateNextRestartTime() {
        const next = new Date();
        next.setHours(next.getHours() + 6); // Default 6-hour restart interval
        fs.writeFileSync(this.configPath, next.toISOString());
    }
}

module.exports = new AutoRestartService();
