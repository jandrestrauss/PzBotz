const os = require('os');
const EventEmitter = require('events');
const logger = require('../utils/logger');

class SystemMonitor extends EventEmitter {
    constructor() {
        super();
        this.thresholds = {
            cpu: 80,
            memory: 90,
            disk: 90
        };
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            const metrics = this.collectMetrics();
            this.checkThresholds(metrics);
            this.emit('metrics', metrics);
        }, 5000);
    }

    collectMetrics() {
        const metrics = {
            cpu: os.loadavg()[0] * 100,
            memory: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
            uptime: os.uptime(),
            networkConnections: this.getNetworkConnections(),
            timestamp: Date.now()
        };

        return metrics;
    }

    checkThresholds(metrics) {
        for (const [key, value] of Object.entries(metrics)) {
            if (this.thresholds[key] && value > this.thresholds[key]) {
                this.handleThresholdExceeded(key, value);
            }
        }
    }

    handleThresholdExceeded(metric, value) {
        logger.warn(`System ${metric} threshold exceeded: ${value}`);
        this.emit('threshold_exceeded', { metric, value });
    }
}

module.exports = new SystemMonitor();
