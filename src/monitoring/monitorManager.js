const EventEmitter = require('events');
const os = require('os');
const logger = require('../utils/logger');

class MonitorManager extends EventEmitter {
    constructor() {
        super();
        this.metrics = new Map();
        this.alerts = new Map();
        this.thresholds = {
            cpu: { warning: 70, critical: 90 },
            memory: { warning: 80, critical: 95 },
            disk: { warning: 85, critical: 95 },
            latency: { warning: 1000, critical: 5000 }
        };
    }

    startMonitoring() {
        this.collectSystemMetrics();
        this.collectApplicationMetrics();
        this.collectNetworkMetrics();
        this.checkThresholds();
    }

    async collectSystemMetrics() {
        setInterval(() => {
            const metrics = {
                cpu: os.loadavg()[0],
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    used: os.totalmem() - os.freemem()
                },
                uptime: os.uptime()
            };
            this.metrics.set('system', metrics);
            this.emit('metrics', { type: 'system', data: metrics });
        }, 30000);
    }

    checkThresholds() {
        setInterval(() => {
            const systemMetrics = this.metrics.get('system');
            if (!systemMetrics) return;

            for (const [metric, thresholds] of Object.entries(this.thresholds)) {
                const value = this.getMetricValue(systemMetrics, metric);
                if (value >= thresholds.critical) {
                    this.raiseAlert('critical', metric, value);
                } else if (value >= thresholds.warning) {
                    this.raiseAlert('warning', metric, value);
                }
            }
        }, 60000);
    }

    raiseAlert(severity, metric, value) {
        const alert = {
            severity,
            metric,
            value,
            timestamp: Date.now()
        };
        this.alerts.set(`${metric}-${severity}`, alert);
        this.emit('alert', alert);
    }
}

module.exports = new MonitorManager();
