const cron = require('node-cron');
const logger = require('./logger');

class Scheduler {
    constructor() {
        this.tasks = new Map();
    }

    addTask(name, schedule, task) {
        try {
            const cronJob = cron.schedule(schedule, async () => {
                try {
                    await task();
                    logger.info(`Task ${name} executed successfully`);
                } catch (error) {
                    logger.error(`Task ${name} failed:`, error);
                }
            });
            
            this.tasks.set(name, cronJob);
            logger.info(`Task ${name} scheduled successfully`);
        } catch (error) {
            logger.error(`Failed to schedule task ${name}:`, error);
        }
    }

    removeTask(name) {
        const task = this.tasks.get(name);
        if (task) {
            task.stop();
            this.tasks.delete(name);
            logger.info(`Task ${name} removed`);
        }
    }

    stopAll() {
        for (const [name, task] of this.tasks) {
            task.stop();
            logger.info(`Task ${name} stopped`);
        }
        this.tasks.clear();
    }
}

module.exports = new Scheduler();
