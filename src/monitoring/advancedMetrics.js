const os = require('os');
const logger = require('../utils/logger');
const { exec } = require('child_process');

class AdvancedMetrics {
    constructor() {
        this.metrics = new Map();
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(async () => {
            try {
                const cpuUsage = this.getCPUUsage();
                const memoryUsage = this.getMemoryUsage();
                const diskIO = await this.getDiskIO();

                this.metrics.set(Date.now(), { cpuUsage, memoryUsage, diskIO });

                if (cpuUsage > 80) {
                    this.alertAdmin('High CPU usage detected');
                }
            } catch (error) {
                logger.error('Error during monitoring:', error);
            }
        }, 60000); // Run every minute
    }

    getCPUUsage() {
        return os.loadavg()[0] * 100;
    }

    getMemoryUsage() {
        return (os.totalmem() - os.freemem()) / os.totalmem() * 100;
    }

    getDiskIO() {
        return new Promise((resolve, reject) => {
            exec('iostat -dx', (error, stdout, stderr) => {
                if (error) {
                    logger.error('Failed to get disk IO:', error);
                    return reject(error);
                }
                const lines = stdout.trim().split('\n');
                const diskStats = lines.slice(3).map(line => {
                    const [device, tps, kB_read, kB_wrtn] = line.split(/\s+/);
                    return { device, tps, kB_read, kB_wrtn };
                });
                resolve(diskStats);
            });
        });
    }

    alertAdmin(message) {
        logger.warn(message);
        // Implement admin alerting logic
    }
}

const collectAdvancedMetrics = () => {
    // Collect CPU usage
    const cpuUsage = process.cpuUsage();
    // Collect memory usage
    const memoryUsage = process.memoryUsage();
    // Collect disk usage
    const diskUsage = getDiskUsage(); // Assume getDiskUsage is a defined function

    // Log metrics
    console.log('CPU Usage:', cpuUsage);
    console.log('Memory Usage:', memoryUsage);
    console.log('Disk Usage:', diskUsage);

    // Check for alerts
    if (cpuUsage.user > 80) {
        sendAlert('High CPU usage detected');
    }
    if (memoryUsage.heapUsed > memoryUsage.heapTotal * 0.8) {
        sendAlert('High memory usage detected');
    }
    if (diskUsage.used > diskUsage.total * 0.8) {
        sendAlert('High disk usage detected');
    }
};

module.exports = { collectAdvancedMetrics };
