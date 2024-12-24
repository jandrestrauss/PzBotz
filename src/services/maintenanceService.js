const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const rconService = require('./rconService');

class MaintenanceService {
    constructor() {
        this.tasks = new Map();
        this.setupTasks();
    }

    setupTasks() {
        // Daily log cleanup at 3 AM
        this.addTask('logCleanup', '0 3 * * *', this.cleanupLogs.bind(this));
        
        // Weekly full maintenance at 4 AM on Monday
        this.addTask('fullMaintenance', '0 4 * * 1', this.performFullMaintenance.bind(this));
        
        // Check disk space every 6 hours
        this.addTask('diskCheck', '0 */6 * * *', this.checkDiskSpace.bind(this));
        
        // Clean old statistics daily at 2 AM
        this.addTask('statsCleanup', '0 2 * * *', this.cleanupStats.bind(this));
    }

    addTask(name, schedule, handler) {
        const task = cron.schedule(schedule, async () => {
            try {
                await handler();
                logger.info(`Maintenance task completed: ${name}`);
            } catch (error) {
                logger.error(`Maintenance task failed: ${name}`, error);
            }
        });
        this.tasks.set(name, task);
    }

    async cleanupLogs() {
        const logsPath = path.join(process.cwd(), 'logs');
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        const files = await fs.promises.readdir(logsPath);
        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(logsPath, file);
            const stats = await fs.promises.stat(filePath);
            
            if (now - stats.mtime.getTime() > maxAge) {
                await fs.promises.unlink(filePath);
                logger.info(`Deleted old log file: ${file}`);
            }
        }
    }

    async performFullMaintenance() {
        // Save and restart server
        await rconService.execute('save');
        await rconService.execute('quit');

        // Wait for server to stop
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Perform maintenance tasks
        await this.cleanupLogs();
        await this.checkDiskSpace();
        
        // Restart server
        await new Promise((resolve, reject) => {
            exec('server.bat', (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    async checkDiskSpace() {
        // Implementation depends on Windows-specific commands
        // This is a basic example using a directory size check
        const checkPath = process.cwd();
        const threshold = 0.9; // 90% full

        return new Promise((resolve, reject) => {
            exec(`dir "${checkPath}" /-c`, (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }

                // Parse directory size information
                // Emit warning if space is low
                resolve();
            });
        });
    }

    async cleanupStats() {
        const stats = require('./statisticsService').getStats();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        Object.keys(stats.dailyStats).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete stats.dailyStats[date];
            }
        });

        require('./statisticsService').saveStats();
        logger.info('Old statistics cleaned up');
    }
}

module.exports = new MaintenanceService();
