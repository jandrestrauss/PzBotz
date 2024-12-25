const logger = require('../utils/logger');
const config = require('../config/config');
const { Worker } = require('worker_threads');
const v8 = require('v8');

class OptimizationService {
    constructor() {
        this.workers = new Map();
        this.gcInterval = null;
        this.loadConfig();
    }

    loadConfig() {
        this.config = config.get('performance') || require('../config/performance.json');
        this.setupHeapLimit();
    }

    setupHeapLimit() {
        const heapLimit = this.parseMemoryString(this.config.memory.heapLimit);
        v8.setFlagsFromString(`--max-old-space-size=${heapLimit}`);
    }

    parseMemoryString(memString) {
        const num = parseInt(memString);
        return memString.includes('GB') ? num * 1024 : num;
    }

    startOptimizations() {
        this.setupGarbageCollection();
        this.initializeWorkerPool();
    }

    setupGarbageCollection() {
        this.gcInterval = setInterval(() => {
            const heapUsed = v8.getHeapStatistics().used_heap_size;
            const heapTotal = v8.getHeapStatistics().total_heap_size;
            
            if (heapUsed / heapTotal > this.config.memory.gcThreshold) {
                global.gc && global.gc();
                logger.info('Manual garbage collection triggered');
            }
        }, this.config.memory.gcInterval);
    }

    initializeWorkerPool() {
        for (let i = 0; i < this.config.workers.minInstances; i++) {
            this.createWorker();
        }
    }

    createWorker() {
        const worker = new Worker('./src/workers/taskWorker.js');
        worker.on('error', error => {
            logger.error('Worker error:', error);
            this.replaceWorker(worker);
        });
        this.workers.set(worker.threadId, worker);
    }

    replaceWorker(oldWorker) {
        this.workers.delete(oldWorker.threadId);
        if (this.workers.size < this.config.workers.minInstances) {
            this.createWorker();
        }
    }

    stop() {
        clearInterval(this.gcInterval);
        for (const worker of this.workers.values()) {
            worker.terminate();
        }
        this.workers.clear();
    }
}

module.exports = new OptimizationService();
