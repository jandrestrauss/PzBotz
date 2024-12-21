const schedule = require('node-schedule');
const logger = require('../utils/logger');

class TaskManager {
    constructor(bot) {
        this.bot = bot;
        this.jobs = new Map();
        this.setupDefaultTasks();
    }

    setupDefaultTasks() {
        // Daily server restart at 4 AM
        this.scheduleTask('dailyRestart', '0 4 * * *', async () => {
            await this.bot.serverManager.initiateRestart(15); // 15 minutes warning
        });

        // Backup every 6 hours
        this.scheduleTask('regularBackup', '0 */6 * * *', async () => {
            await this.bot.serverManager.createBackup();
        });

        // Check mod updates every hour
        this.scheduleTask('modCheck', '0 * * * *', async () => {
            await this.bot.modManager.checkUpdates();
        });

        // Server health check every 5 minutes
        this.scheduleTask('healthCheck', '*/5 * * * *', async () => {
            await this.bot.serverManager.checkHealth();
        });
    }

    scheduleTask(name, cronExpression, task) {
        try {
            const job = schedule.scheduleJob(cronExpression, async () => {
                try {
                    await task();
                    logger.info(`Task ${name} completed successfully`);
                } catch (error) {
                    logger.error(`Task ${name} failed:`, error);
                }
            });
            this.jobs.set(name, job);
            logger.info(`Scheduled task ${name} with cron: ${cronExpression}`);
        } catch (error) {
            logger.error(`Failed to schedule task ${name}:`, error);
        }
    }

    cancelTask(name) {
        const job = this.jobs.get(name);
        if (job) {
            job.cancel();
            this.jobs.delete(name);
            logger.info(`Cancelled task ${name}`);
            return true;
        }
        return false;
    }

    listTasks() {
        return Array.from(this.jobs.keys());
    }

    getNextRun(name) {
        const job = this.jobs.get(name);
        return job ? job.nextInvocation() : null;
    }
}

module.exports = TaskManager;
