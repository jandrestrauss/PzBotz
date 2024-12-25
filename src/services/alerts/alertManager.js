const EventEmitter = require('events');
const logger = require('../../utils/logger');

class AlertManager extends EventEmitter {
    constructor() {
        super();
        this.thresholds = new Map([
            ['cpu', { warning: 70, critical: 90 }],
            ['memory', { warning: 80, critical: 95 }],
            ['disk', { warning: 85, critical: 95 }]
        ]);
        this.activeAlerts = new Map();
    }

    checkThreshold(metric, value) {
        const threshold = this.thresholds.get(metric);
        if (!threshold) return null;

        if (value >= threshold.critical) return 'CRITICAL';
        if (value >= threshold.warning) return 'WARNING';
        return null;
    }

    async handleMetric(metric, value) {
        const severity = this.checkThreshold(metric, value);
        if (!severity) {
            this.clearAlert(metric);
            return;
        }

        const alert = {
            metric,
            value,
            severity,
            timestamp: Date.now()
        };

        this.raiseAlert(alert);
    }

    raiseAlert(alert) {
        this.activeAlerts.set(alert.metric, alert);
        this.emit('alert', alert);
        logger.warn(`Alert: ${alert.severity} - ${alert.metric} at ${alert.value}`);
    }

    clearAlert(metric) {
        if (this.activeAlerts.has(metric)) {
            this.activeAlerts.delete(metric);
            this.emit('alertCleared', metric);
        }
    }
}

module.exports = new AlertManager();
