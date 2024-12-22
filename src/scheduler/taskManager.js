const cron = require('node-cron');
const logger = require('../utils/logger');
const backup = require('../backup');
const monitoring = require('../monitoring');
const auditLogger = require('../utils/auditLogger');

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

        logger.info('Task manager initialized');
    }

    scheduleTask(name, schedule, task) {
        try {
            const cronJob = cron.schedule(schedule, task);
            this.tasks.set(name, cronJob);
            logger.info(`Scheduled task '${name}' registered`);
        } catch (error) {
            logger.error(`Failed to schedule task '${name}':`, error);
        }
    }
}

module.exports = new TaskManager();
