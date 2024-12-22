const cron = require('node-cron');
const logger = require('../logging/logger');

class TaskScheduler {
    constructor() {
        this.tasks = new Map();
        this.setupDefaultTasks();
    }

    setupDefaultTasks() {
        this.schedule('backup', '0 0 * * *', async () => {
            logger.logEvent('Starting daily backup');
            await require('../backup/backup').performBackup();
        });

        this.schedule('maintenance', '0 4 * * *', async () => {
            logger.logEvent('Starting maintenance');
            await this.performMaintenance();
        });
    }

    schedule(name, cronPattern, task) {
        if (this.tasks.has(name)) {
            throw new Error(`Task ${name} already exists`);
        }

        const job = cron.schedule(cronPattern, async () => {
            try {
                await task();
            } catch (error) {
                logger.logEvent(`Task ${name} failed: ${error.message}`);
            }
        });

        this.tasks.set(name, { job, pattern: cronPattern });
    }
}

module.exports = new TaskScheduler();
