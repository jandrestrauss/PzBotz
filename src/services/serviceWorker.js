const logger = require('../utils/logger');
const EventEmitter = require('events');

class ServiceWorker extends EventEmitter {
    constructor() {
        super();
        this.tasks = new Map();
        this.intervals = new Map();
        this.running = false;
    }

    registerTask(name, handler, interval) {
        this.tasks.set(name, {
            handler,
            interval,
            lastRun: 0
        });
        logger.logEvent(`Registered task: ${name}`);
    }

    async start() {
        if (this.running) return;
        this.running = true;

        for (const [name, task] of this.tasks) {
            this.scheduleTask(name, task);
        }

        logger.logEvent('Service worker started');
    }

    scheduleTask(name, task) {
        const interval = setInterval(async () => {
            try {
                await task.handler();
                task.lastRun = Date.now();
                this.emit('taskComplete', { name, success: true });
            } catch (error) {
                logger.error(`Task ${name} failed:`, error);
                this.emit('taskError', { name, error });
            }
        }, task.interval);

        this.intervals.set(name, interval);
    }

    stop() {
        if (!this.running) return;
        this.running = false;

        for (const interval of this.intervals.values()) {
            clearInterval(interval);
        }
        this.intervals.clear();

        logger.logEvent('Service worker stopped');
    }

    getTaskStatus(name) {
        const task = this.tasks.get(name);
        if (!task) return null;

        return {
            name,
            lastRun: task.lastRun,
            interval: task.interval,
            running: this.intervals.has(name)
        };
    }

    getAllTaskStatus() {
        return Array.from(this.tasks.keys())
            .map(name => this.getTaskStatus(name));
    }
}

module.exports = new ServiceWorker();
