const os = require('os');
const { serverState } = require('../server/serverManager');
const { dbOptimizer } = require('../database/optimizer');

class MetricsCollector {
    constructor() {
        this.metrics = {
            system: new Map(),
            application: new Map(),
            database: new Map()
        };
        
        this.startCollection();
    }

    startCollection() {
        setInterval(() => this.collectSystemMetrics(), 5000);
        setInterval(() => this.collectAppMetrics(), 10000);
        setInterval(() => this.collectDbMetrics(), 15000);
    }

    async collectSystemMetrics() {
        const metrics = {
            cpu: os.loadavg()[0],
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };
        
        this.metrics.system.set(Date.now(), metrics);
        this.pruneOldMetrics();
    }
}

module.exports = new MetricsCollector();
