const os = require('os');
const { exec } = require('child_process');
const logger = require('../utils/logger');
const EventEmitter = require('events');
const performanceMonitor = require('../monitoring/performanceMonitor');
const serviceIntegrator = require('../core/serviceIntegrator');

class HealthCheck extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            system: {},
            process: {},
            custom: {}
        };
        this.thresholds = {
            cpu: 80,
            memory: 90,
            disk: 85,
            responseTime: 5000
        };
    }

    async check() {
        try {
            await Promise.all([
                this.checkSystem(),
                this.checkProcess(),
                this.checkCustomMetrics()
            ]);

            this.evaluateHealth();
            return this.metrics;
        } catch (error) {
            logger.error('Health check failed:', error);
            throw error;
        }
    }

    async checkSystem() {
        this.metrics.system = {
            cpuLoad: os.loadavg()[0],
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
            platform: os.platform(),
            arch: os.arch()
        };

        // Windows-specific disk space check
        if (os.platform() === 'win32') {
            await this.checkDiskSpace();
        }
    }

    checkProcess() {
        const proc = process.memoryUsage();
        this.metrics.process = {
            heapUsed: proc.heapUsed,
            heapTotal: proc.heapTotal,
            external: proc.external,
            uptime: process.uptime()
        };
    }

    async checkCustomMetrics() {
        this.metrics.custom = {
            activeConnections: 0, // Implement connection tracking
            pendingTasks: 0,      // Implement task queue monitoring
            responseTime: 0       // Implement response time monitoring
        };
    }

    evaluateHealth() {
        const memoryUsage = (this.metrics.system.totalMemory - this.metrics.system.freeMemory) / 
                           this.metrics.system.totalMemory * 100;

        if (this.metrics.system.cpuLoad > this.thresholds.cpu) {
            this.emit('warning', {
                type: 'cpu',
                value: this.metrics.system.cpuLoad,
                threshold: this.thresholds.cpu
            });
        }

        if (memoryUsage > this.thresholds.memory) {
            this.emit('warning', {
                type: 'memory',
                value: memoryUsage,
                threshold: this.thresholds.memory
            });
        }
    }

    async checkDiskSpace() {
        return new Promise((resolve, reject) => {
            exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                const lines = stdout.trim().split('\n');
                const disks = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const [caption, freespace, size] = lines[i].trim().split(/\s+/);
                    if (caption && freespace && size) {
                        disks.push({
                            drive: caption,
                            free: parseInt(freespace),
                            total: parseInt(size)
                        });
                    }
                }
                
                this.metrics.system.disks = disks;
                resolve(disks);
            });
        });
    }

    async checkHealth() {
        const health = {
            status: 'healthy',
            services: {},
            performance: performanceMonitor.getPerformanceReport(),
            timestamp: new Date().toISOString()
        };

        try {
            // Check all services
            for (const [name, service] of serviceIntegrator.services) {
                health.services[name] = await this.checkService(service);
            }

            // Set overall status
            if (Object.values(health.services).some(s => s.status === 'critical')) {
                health.status = 'critical';
            } else if (Object.values(health.services).some(s => s.status === 'warning')) {
                health.status = 'warning';
            }

        } catch (error) {
            logger.error('Health check failed:', error);
            health.status = 'critical';
            health.error = error.message;
        }

        return health;
    }

    async checkService(service) {
        const status = {
            status: 'healthy',
            lastCheck: new Date().toISOString()
        };

        try {
            if (service.healthCheck) {
                const serviceHealth = await service.healthCheck();
                Object.assign(status, serviceHealth);
            }
        } catch (error) {
            status.status = 'critical';
            status.error = error.message;
        }

        return status;
    }
}

module.exports = new HealthCheck();
