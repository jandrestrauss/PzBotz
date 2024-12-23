const os = require('os');
const EventEmitter = require('events');
const logger = require('../logging/logger');

class UnifiedMonitor extends EventEmitter {
    constructor() {
        super();
        this.thresholds = {
            cpu: 90,       // 90% usage
            memory: 85,    // 85% usage
            disk: 90,      // 90% usage
            latency: 1000  // 1000ms
        };
        this.metrics = {};
        this.recoveryStrategies = new Map();
        this.setupRecoveryStrategies();
    }

    setupRecoveryStrategies() {
        this.recoveryStrategies.set('cpu', async () => {
            logger.info('Initiating CPU recovery');
            await this.optimizeProcesses();
        });
        
        this.recoveryStrategies.set('memory', async () => {
            logger.info('Initiating memory recovery');
            await this.clearMemoryLeaks();
        });
        
        this.recoveryStrategies.set('disk', async () => {
            logger.info('Initiating disk cleanup');
            await this.cleanupDiskSpace();
        });
    }

    startMonitoring() {
        this.monitoringInterval = setInterval(async () => {
            const metrics = await this.collectMetrics();
            this.checkThresholds(metrics);
            this.emit('metrics', metrics);
        }, 60000); // Check every minute
    }

    async collectMetrics() {
        const cpuUsage = await this.getCPUUsage();
        const memoryUsage = this.getMemoryUsage();
        const diskUsage = await this.getDiskIO();
        const networkStats = await this.getNetworkStats();

        this.metrics = {
            timestamp: new Date().toISOString(),
            cpu: cpuUsage,
            memory: memoryUsage,
            disk: diskUsage,
            network: networkStats,
            system: {
                uptime: os.uptime(),
                loadavg: os.loadavg()
            }
        };

        return this.metrics;
    }

    async getCPUUsage() {
        const cpus = os.cpus();
        const totalTimes = cpus.reduce((acc, cpu) => {
            Object.keys(cpu.times).forEach(type => {
                acc[type] = (acc[type] || 0) + cpu.times[type];
            });
            return acc;
        }, {});

        return {
            usage: (1 - totalTimes.idle / Object.values(totalTimes).reduce((a, b) => a + b)) * 100,
            load: os.loadavg()[0]
        };
    }

    getMemoryUsage() {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;
        
        return {
            total,
            free,
            used,
            percentage: (used / total) * 100
        };
    }

    async getDiskIO() {
        // Implementation would depend on OS-specific tools
        // This is a placeholder that could be implemented using various OS-specific methods
        return {
            read: 0,
            write: 0,
            usage: 85 // Example value
        };
    }

    async getNetworkStats() {
        // Implementation would depend on OS-specific tools
        return {
            bytesIn: 0,
            bytesOut: 0,
            connections: 0
        };
    }

    checkThresholds(metrics) {
        if (metrics.cpu.usage > this.thresholds.cpu) {
            this.handleThresholdExceeded('cpu', metrics.cpu.usage);
        }
        
        if (metrics.memory.percentage > this.thresholds.memory) {
            this.handleThresholdExceeded('memory', metrics.memory.percentage);
        }
        
        if (metrics.disk.usage > this.thresholds.disk) {
            this.handleThresholdExceeded('disk', metrics.disk.usage);
        }
    }

    async handleThresholdExceeded(metric, value) {
        logger.warn(`Threshold exceeded for ${metric}`, { value, threshold: this.thresholds[metric] });
        this.emit('threshold_exceeded', { metric, value, threshold: this.thresholds[metric] });
        
        const recoveryStrategy = this.recoveryStrategies.get(metric);
        if (recoveryStrategy) {
            try {
                await recoveryStrategy();
            } catch (error) {
                logger.error('Recovery strategy failed', { metric, error: error.message });
            }
        }
    }

    async optimizeProcesses() {
        // Implementation of process optimization
        logger.info('Optimizing processes');
    }

    async clearMemoryLeaks() {
        // Implementation of memory cleanup
        logger.info('Clearing memory leaks');
        global.gc && global.gc();
    }

    async cleanupDiskSpace() {
        // Implementation of disk cleanup
        logger.info('Cleaning up disk space');
    }

    stop() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
}

module.exports = UnifiedMonitor;