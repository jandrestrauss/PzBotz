const EventEmitter = require('events');

class MetricsCollector extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            performance: new Map(),
            errors: new Map(),
            usage: new Map()
        };
        this.startCollection();
    }

    startCollection() {
        setInterval(() => {
            this.collectPerformanceMetrics();
            this.analyzeMetrics();
            this.cleanupOldMetrics();
        }, 15000);
    }

    collectPerformanceMetrics() {
        const timestamp = Date.now();
        this.metrics.performance.set(timestamp, {
            cpu: process.cpuUsage(),
            memory: process.memoryUsage(),
            timestamp
        });
    }
}

module.exports = new MetricsCollector();
