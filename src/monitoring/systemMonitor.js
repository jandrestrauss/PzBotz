const os = require('os');
const EventEmitter = require('events');
const logger = require('../logging/logger');

class SystemMonitor extends EventEmitter {
    constructor() {
        super();
        this.metrics = new Map();
        this.alerts = new Set();
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            this.collectMetrics();
            this.analyzeMetrics();
        }, 5000);
    }

    collectMetrics() {
        this.metrics.set('cpu', os.loadavg()[0]);
        this.metrics.set('memory', process.memoryUsage().heapUsed);
        this.metrics.set('uptime', process.uptime());
    }

    analyzeMetrics() {
        if (this.metrics.get('cpu') > 80) {
            this.emit('high_cpu_usage', this.metrics.get('cpu'));
            logger.logEvent('High CPU usage detected');
        }
    }
}

module.exports = new SystemMonitor();
