const os = require('os');

class PerformanceUtil {
    constructor() {
        this.metrics = new Map();
        this.thresholds = {
            memory: process.env.MEMORY_THRESHOLD || 90,
            cpu: process.env.CPU_THRESHOLD || 80
        };
    }

    startMonitoring(service) {
        const startTime = process.hrtime();
        return () => {
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const duration = seconds * 1000 + nanoseconds / 1e6;
            this.recordMetric(service, duration);
            return duration;
        };
    }

    recordMetric(service, duration) {
        if (!this.metrics.has(service)) {
            this.metrics.set(service, []);
        }
        const metrics = this.metrics.get(service);
        metrics.push({ timestamp: Date.now(), duration });

        // Keep only last hour of metrics
        const hourAgo = Date.now() - 3600000;
        this.metrics.set(service, 
            metrics.filter(m => m.timestamp > hourAgo)
        );
    }

    getCPUUsage() {
        return os.loadavg()[0] * 100;
    }

    getMemoryUsage() {
        return (os.totalmem() - os.freemem()) / os.totalmem() * 100;
    }
}

module.exports = new PerformanceUtil();
