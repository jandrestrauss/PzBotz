const os = require('os');
const { exec } = require('child_process');
const logger = require('../utils/logger');

class ServerMonitor {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            uptime: 0,
            players: 0
        };
        this.interval = null;
    }

    start() {
        this.interval = setInterval(() => this.collectMetrics(), 30000);
        logger.info('Server monitoring started');
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        logger.info('Server monitoring stopped');
    }

    async collectMetrics() {
        try {
            const cpuUsage = os.loadavg()[0];
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

            this.metrics = {
                cpu: cpuUsage,
                memory: memoryUsage,
                uptime: os.uptime(),
                players: await this.getPlayerCount()
            };

            this.checkThresholds();
        } catch (error) {
            logger.error('Error collecting metrics:', error);
        }
    }

    async getPlayerCount() {
        return new Promise((resolve) => {
            exec('tasklist | find /i "java.exe" /c', (error, stdout) => {
                if (error) {
                    logger.error('Error getting player count:', error);
                    resolve(0);
                    return;
                }
                resolve(parseInt(stdout.trim()) || 0);
            });
        });
    }

    checkThresholds() {
        if (this.metrics.cpu > 80) {
            logger.warn(`High CPU usage: ${this.metrics.cpu}%`);
        }
        if (this.metrics.memory > 90) {
            logger.warn(`High memory usage: ${this.metrics.memory}%`);
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

module.exports = new ServerMonitor();
