const os = require('os');
const { exec } = require('child_process');
const EventEmitter = require('events');
const logger = require('../utils/logger');

class SystemStats extends EventEmitter {
    constructor() {
        super();
        this.stats = {
            cpu: 0,
            memory: 0,
            uptime: 0,
            players: 0,
            lastUpdate: null
        };
        this.interval = null;
    }

    start() {
        this.interval = setInterval(() => this.collectStats(), 30000);
        logger.info('System stats monitoring started');
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async collectStats() {
        try {
            const cpuUsage = os.loadavg()[0];
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

            this.stats = {
                cpu: cpuUsage,
                memory: memoryUsage,
                uptime: os.uptime(),
                players: await this.getPlayerCount(),
                lastUpdate: new Date()
            };

            this.checkThresholds();
            this.emit('stats', this.stats);
        } catch (error) {
            logger.error('Error collecting system stats:', error);
        }
    }

    getPlayerCount() {
        return new Promise((resolve) => {
            exec('tasklist /FI "IMAGENAME eq java.exe"', (error, stdout) => {
                if (error) {
                    logger.error('Error getting player count:', error);
                    resolve(0);
                    return;
                }
                // This is a basic implementation - you might want to use RCON
                // to get the actual player count from the server
                resolve(stdout.toLowerCase().includes('java.exe') ? 1 : 0);
            });
        });
    }

    checkThresholds() {
        if (this.stats.cpu > 80) {
            logger.warn(`High CPU usage: ${this.stats.cpu.toFixed(2)}%`);
            this.emit('alert', 'cpu', this.stats.cpu);
        }
        if (this.stats.memory > 90) {
            logger.warn(`High memory usage: ${this.stats.memory.toFixed(2)}%`);
            this.emit('alert', 'memory', this.stats.memory);
        }
    }

    getStats() {
        return this.stats;
    }
}

module.exports = new SystemStats();
