const schedule = require('node-schedule');
const logger = require('../utils/logger');
const backup = require('../modules/serverManager');
const monitoring = require('../monitoring');
const auditLogger = require('../utils/logger');

class TaskManager {
    constructor() {
        this.tasks = new Map();
    }

    initialize() {
        // Daily backup at 3 AM
        this.scheduleTask('backup', '0 3 * * *', async () => {
            await backup.createBackup();
            await auditLogger.log('BACKUP', 'SYSTEM', { type: 'scheduled' });
        });

        // Server metrics every 5 minutes
        this.scheduleTask('metrics', '*/5 * * * *', async () => {
            const metrics = await monitoring.collectMetrics();
            if (metrics.cpu > 80 || metrics.memory > 90) {
                await auditLogger.log('HIGH_RESOURCE_USAGE', 'SYSTEM', metrics);
            }
        });

        // Weekly maintenance restart
        this.scheduleTask('restart', '0 4 * * MON', async () => {
            await global.serverManager.scheduleRestart(300000); // 5 minutes warning
            await auditLogger.log('SCHEDULED_RESTART', 'SYSTEM', { type: 'weekly' });
        });

        // Log rotation at midnight
        this.scheduleTask('logRotation', '0 0 * * *', async () => {
            await auditLogger.rotateLogs();
        });

        logger.info('Task manager initialized');
    }

    scheduleTask(name, cron, task) {
        const job = schedule.scheduleJob(cron, task);
        this.tasks.set(name, job);
    }
}

module.exports = new TaskManager();
