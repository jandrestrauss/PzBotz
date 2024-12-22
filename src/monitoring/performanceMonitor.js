const os = require('os');
const gameEvents = require('../events/eventEmitter');

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            cpu: new Map(),
            memory: new Map(),
            network: new Map()
        };
        
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => this.collectMetrics(), 5000);
        setInterval(() => this.analyzePerformance(), 60000);
    }

    collectMetrics() {
        const timestamp = Date.now();
        this.metrics.cpu.set(timestamp, os.loadavg()[0]);
        this.metrics.memory.set(timestamp, process.memoryUsage());
        
        if (this.metrics.cpu.size > 720) { // Keep 1 hour of data
            const oldestKey = this.metrics.cpu.keys().next().value;
            this.metrics.cpu.delete(oldestKey);
        }
    }

    analyzePerformance() {
        const analysis = {
            avgCpu: this.calculateAverage([...this.metrics.cpu.values()]),
            memoryLeakCheck: this.checkMemoryLeak(),
            timestamp: Date.now()
        };

        if (analysis.avgCpu > 80 || analysis.memoryLeakCheck) {
            gameEvents.emit('performanceAlert', analysis);
        }
    }
}

module.exports = new PerformanceMonitor();
