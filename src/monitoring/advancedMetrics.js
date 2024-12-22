const os = require('os');
const { collectDefaultMetrics, Registry } = require('prom-client');
const { EventEmitter } = require('events');
const logger = require('../utils/logger');

class AdvancedMetrics extends EventEmitter {
    constructor() {
        super();
        this.registry = new Registry();
        this.metrics = {
            system: new Map(),
            application: new Map(),
            performance: new Map(),
            playerCount: 0,
            cpuUsage: 0,
            memoryUsage: 0,
            networkStats: {},
            systemLoad: []
        };
        
        this.setupCollectors();
        collectDefaultMetrics({ register: this.registry });
        this.startCollecting();
    }

    setupCollectors() {
        setInterval(() => {
            this.collectSystemMetrics();
            this.analyzePerformance();
        }, 5000);
    }

    startCollecting() {
        setInterval(() => {
            this.collectSystemMetrics();
            this.collectApplicationMetrics();
            this.checkThresholds();
        }, 5000);
    }

    async collectSystemMetrics() {
        this.metrics.cpuUsage = os.loadavg()[0];
        this.metrics.memoryUsage = process.memoryUsage().heapUsed;
        this.metrics.systemLoad.push({
            timestamp: Date.now(),
            cpu: this.metrics.cpuUsage,
            memory: this.metrics.memoryUsage
        });

        if (this.metrics.systemLoad.length > 720) { // Keep 1 hour of data
            this.metrics.systemLoad.shift();
        }
    }

    async checkThresholds() {
        const cpuUsage = this.metrics.system.get('cpu');
        const memoryUsage = this.metrics.system.get('memory');
        
        if (cpuUsage > 80 || memoryUsage > 90) {
            this.emit('threshold_exceeded', { cpuUsage, memoryUsage });
        }
    }
}

module.exports = new AdvancedMetrics();
