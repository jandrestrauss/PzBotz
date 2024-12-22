const os = require('os');
const disk = require('diskusage');
const logger = require('./logger');
const config = require('../config/production');

class ServerHealth {
    async checkSystem() {
        try {
            const [diskSpace, memory, cpu] = await Promise.all([
                this.checkDiskSpace(),
                this.checkMemory(),
                this.checkCPU()
            ]);

            const alerts = [];
            if (diskSpace.usagePercent > config.monitoring.alertThresholds.diskSpace) {
                alerts.push(`High disk usage: ${diskSpace.usagePercent}%`);
            }
            if (memory.usagePercent > config.monitoring.alertThresholds.memory) {
                alerts.push(`High memory usage: ${memory.usagePercent}%`);
            }
            if (cpu > config.monitoring.alertThresholds.cpu) {
                alerts.push(`High CPU usage: ${cpu}%`);
            }

            if (alerts.length > 0) {
                await this.notifyAdmins(alerts);
            }

            return { diskSpace, memory, cpu, alerts };
        } catch (error) {
            logger.error('Health check failed:', error);
            return null;
        }
    }

    async checkDiskSpace() {
        const { free, total } = await disk.check(config.server.gameDir);
        const usagePercent = ((total - free) / total) * 100;
        return { free, total, usagePercent };
    }

    checkMemory() {
        const free = os.freemem();
        const total = os.totalmem();
        const usagePercent = ((total - free) / total) * 100;
        return { free, total, usagePercent };
    }

    async checkCPU() {
        return new Promise(resolve => {
            const startUsage = process.cpuUsage();
            setTimeout(() => {
                const endUsage = process.cpuUsage(startUsage);
                const totalUsage = (endUsage.user + endUsage.system) / 1000000;
                resolve(Math.round(totalUsage * 100));
            }, 100);
        });
    }
}

module.exports = new ServerHealth();
