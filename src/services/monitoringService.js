const os = require('os');
const { exec } = require('child_process');
const logger = require('../utils/logger');
const eventManager = require('./eventManager');
const alertSystem = require('./alertSystem');

class MonitoringService {
    constructor() {
        this.interval = null;
        this.metrics = {
            system: {},
            server: {},
            players: new Map()
        };
        this.thresholds = {
            cpu: 80,
            memory: 90,
            playerCount: 50
        };
    }

    start() {
        this.interval = setInterval(() => this.collect(), 30000);
        logger.logEvent('Monitoring service started');
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async collect() {
        try {
            await Promise.all([
                this.collectSystemMetrics(),
                this.collectServerMetrics(),
                this.collectPlayerMetrics()
            ]);

            this.checkThresholds();
            eventManager.handleEvent('metricsCollected', this.getMetrics());
        } catch (error) {
            logger.error('Error collecting metrics:', error);
        }
    }

    async collectSystemMetrics() {
        this.metrics.system = {
            cpu: os.loadavg()[0],
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            uptime: os.uptime(),
            timestamp: Date.now()
        };
    }

    getMetrics() {
        return {
            ...this.metrics,
            timestamp: Date.now()
        };
    }

    checkThresholds() {
        const cpuUsage = this.metrics.system.cpu;
        const memoryUsage = (this.metrics.system.memory.used / this.metrics.system.memory.total) * 100;
        const playerCount = this.metrics.players.size;

        if (cpuUsage > this.thresholds.cpu) {
            alertSystem.sendAlert('WARNING', 'High CPU Usage', 
                `CPU usage is at ${cpuUsage.toFixed(2)}%`);
        }

        if (memoryUsage > this.thresholds.memory) {
            alertSystem.sendAlert('WARNING', 'High Memory Usage', 
                `Memory usage is at ${memoryUsage.toFixed(2)}%`);
        }

        if (playerCount > this.thresholds.playerCount) {
            alertSystem.sendAlert('WARNING', 'High Player Count', 
                `Player count is at ${playerCount}`);
        }
    }
}

module.exports = new MonitoringService();
