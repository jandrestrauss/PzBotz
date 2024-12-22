const logger = require('./logger');

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.thresholds = {
            commandResponse: 1000, // 1 second
            databaseQuery: 500,    // 500ms
            apiResponse: 2000      // 2 seconds
        };
    }

    startTimer(operation) {
        const start = process.hrtime();
        return () => {
            const [seconds, nanoseconds] = process.hrtime(start);
            const duration = seconds * 1000 + nanoseconds / 1e6;
            this.recordMetric(operation, duration);
            return duration;
        };
    }

    recordMetric(operation, duration) {
        if (!this.metrics.has(operation)) {
            this.metrics.set(operation, []);
        }
        this.metrics.get(operation).push(duration);

        if (duration > this.thresholds[operation]) {
            logger.warn(`Performance warning: ${operation} took ${duration}ms`);
        }
    }

    getMetrics() {
        const result = {};
        for (const [operation, durations] of this.metrics) {
            result[operation] = {
                average: durations.reduce((a, b) => a + b, 0) / durations.length,
                max: Math.max(...durations),
                min: Math.min(...durations),
                count: durations.length
            };
        }
        return result;
    }
}

module.exports = new PerformanceMonitor();
