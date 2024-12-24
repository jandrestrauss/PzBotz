const cron = require('node-cron');
const logger = require('../utils/logger');
const EventEmitter = require('events');

class JobScheduler extends EventEmitter {
    constructor() {
        super();
        this.jobs = new Map();
        this.stats = {
            completed: 0,
            failed: 0,
            lastRun: null
        };
    }

    schedule(name, cronPattern, task, options = {}) {
        if (this.jobs.has(name)) {
            throw new Error(`Job ${name} already exists`);
        }

        const job = {
            task,
            schedule: cron.schedule(cronPattern, async () => {
                try {
                    await this.executeJob(name, task);
                } catch (error) {
                    logger.error(`Job ${name} failed:`, error);
                    this.stats.failed++;
                    this.emit('jobFailed', { name, error });
                }
            }, options),
            stats: {
                runs: 0,
                failures: 0,
                lastRun: null,
                lastError: null
            }
        };

        this.jobs.set(name, job);
        logger.logEvent(`Scheduled job: ${name} with pattern: ${cronPattern}`);
        return job;
    }

    async executeJob(name, task) {
        const job = this.jobs.get(name);
        const startTime = Date.now();

        try {
            await task();
            job.stats.runs++;
            job.stats.lastRun = new Date();
            this.stats.completed++;
            this.stats.lastRun = new Date();
            this.emit('jobCompleted', { 
                name, 
                duration: Date.now() - startTime 
            });
        } catch (error) {
            job.stats.failures++;
            job.stats.lastError = error;
            throw error;
        }
    }

    stop(name) {
        const job = this.jobs.get(name);
        if (job) {
            job.schedule.stop();
            this.jobs.delete(name);
            logger.logEvent(`Stopped job: ${name}`);
        }
    }

    stopAll() {
        for (const [name] of this.jobs) {
            this.stop(name);
        }
        logger.logEvent('All jobs stopped');
    }

    getJobStatus(name) {
        return this.jobs.get(name)?.stats || null;
    }

    getStats() {
        return {
            ...this.stats,
            activeJobs: this.jobs.size,
            jobs: Array.from(this.jobs.entries()).map(([name, job]) => ({
                name,
                stats: job.stats
            }))
        };
    }
}

module.exports = new JobScheduler();
