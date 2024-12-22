const os = require('os');
const logger = require('./utils/logger');
const notifications = require('./modules/notifications');

class MonitoringSystem {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            uptime: 0,
            playerCount: 0
        };
        this.alertThresholds = {
            cpuHigh: 80,
            memoryHigh: 90
        };
    }

    async collectMetrics() {
        try {
            this.metrics.cpu = await this.getCPUUsage();
            this.metrics.memory = this.getMemoryUsage();
            this.checkThresholds();
            return this.metrics;
        } catch (error) {
            logger.error('Failed to collect metrics:', error);
        }
    }

    async getCPUUsage() {
        const cpus = os.cpus();
        const usage = cpus.reduce((acc, cpu) => {
            const total = Object.values(cpu.times).reduce((a, b) => a + b);
            const idle = cpu.times.idle;
            return acc + ((total - idle) / total) * 100;
        }, 0) / cpus.length;
        return Math.round(usage);
    }

    getMemoryUsage() {
        const used = os.totalmem() - os.freemem();
        return Math.round((used / os.totalmem()) * 100);
    }

    checkThresholds() {
        if (this.metrics.cpu > this.alertThresholds.cpuHigh) {
            const message = `High CPU usage: ${this.metrics.cpu}%`;
            logger.warn(message);
            notifications.sendAlert(message);
        }
        if (this.metrics.memory > this.alertThresholds.memoryHigh) {
            const message = `High memory usage: ${this.metrics.memory}%`;
            logger.warn(message);
            notifications.sendAlert(message);
        }
    }

    async getServerMetrics() {
        // Logic to get server metrics
        return {
            cpuUsage: 30,
            memoryUsage: 70,
            playerCount: 5
        };
    }

    async setupAlertSystem() {
        // Logic to set up alert system
        setInterval(async () => {
            const metrics = await this.getServerMetrics();
            if (metrics.cpuUsage > 80) {
                this.sendAlert('High CPU usage');
            }
            if (metrics.memoryUsage > 90) {
                this.sendAlert('High memory usage');
            }
        }, 60000);
    }

    sendAlert(message) {
        // Logic to send alert
        logger.warn(message);
        notifications.sendAlert(message);
    }
}

module.exports = new MonitoringSystem();