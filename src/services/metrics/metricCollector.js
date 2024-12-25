const EventEmitter = require('events');
const os = require('os');
const logger = require('../../utils/logger');

class MetricCollector extends EventEmitter {
    constructor() {
        super();
        this.metrics = new Map();
        this.intervals = new Map([
            ['system', 30000],    // 30 seconds
            ['players', 60000],   // 1 minute
            ['commands', 300000]   // 5 minutes
        ]);
    }

    async startCollection() {
        for (const [type, interval] of this.intervals) {
            setInterval(() => this.collect(type), interval);
        }
        logger.info('Metric collection started');
    }

    async collect(type) {
        try {
            const data = await this[`collect${type.charAt(0).toUpperCase() + type.slice(1)}`]();
            this.metrics.set(type, {
                timestamp: Date.now(),
                data
            });
            this.emit('metricsCollected', { type, data });
        } catch (error) {
            logger.error(`Failed to collect ${type} metrics:`, error);
        }
    }

    async collectSystem() {
        return {
            cpu: os.loadavg()[0],
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            uptime: os.uptime()
        };
    }

    getMetrics(type) {
        return type ? this.metrics.get(type) : Object.fromEntries(this.metrics);
    }
}

module.exports = new MetricCollector();
