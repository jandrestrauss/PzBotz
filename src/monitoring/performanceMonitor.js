const EventEmitter = require('events');
const os = require('os');
const logger = require('../utils/logger');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

class PerformanceMonitor extends EventEmitter {
    constructor() {
        super();
        this.metrics = [];
        this.alerts = [];
        this.interval = null;
        this.config = {
            sampleInterval: 60000,
            retentionPeriod: 24 * 60 * 60 * 1000,
            thresholds: {
                cpu: { warning: 70, critical: 90 },
                memory: { warning: 80, critical: 95 },
                disk: { warning: 85, critical: 95 },
                network: { warning: 100, critical: 500 },
                eventLoop: { warning: 100, critical: 500 },
                diskIO: { warning: 100, critical: 500 },
                latency: { warning: 100, critical: 500 },
                packetLoss: { warning: 1, critical: 5 },
                temperature: { warning: 70, critical: 90 }
            }
        };
        this.chartRenderer = new ChartJSNodeCanvas({ width: 800, height: 400, backgroundColour: 'white' });
    }

    startMonitoring() {
        this.interval = setInterval(() => this.collectMetrics(), this.config.sampleInterval);
        logger.info('Performance monitoring started');
    }

    async collectMetrics() {
        const metrics = {
            timestamp: Date.now(),
            system: await this.getSystemMetrics(),
            process: this.getProcessMetrics(),
            custom: await this.getCustomMetrics()
        };

        this.metrics.push(metrics);
        this.cleanOldMetrics();
        this.checkThresholds(metrics);
        this.emit('metrics', metrics);
    }

    async getSystemMetrics() {
        return {
            cpu: os.loadavg()[0],
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            uptime: os.uptime(),
            network: await this.getNetworkMetrics(),
            eventLoop: await this.getEventLoopMetrics(),
            diskIO: await this.getDiskIOMetrics(),
            latency: await this.getLatencyMetrics(),
            packetLoss: await this.getPacketLossMetrics(),
            temperature: await this.getTemperatureMetrics()
        };
    }

    async getNetworkMetrics() {
        // Implement network metrics collection
        return {
            inbound: 0,
            outbound: 0
        };
    }

    async getEventLoopMetrics() {
        // Implement event loop metrics collection
        return {
            delay: 0
        };
    }

    async getDiskIOMetrics() {
        // Implement disk I/O metrics collection
        return {
            read: 0,
            write: 0
        };
    }

    async getLatencyMetrics() {
        // Implement latency metrics collection
        return {
            latency: 0
        };
    }

    async getPacketLossMetrics() {
        // Implement packet loss metrics collection
        return {
            packetLoss: 0
        };
    }

    async getTemperatureMetrics() {
        // Implement temperature metrics collection
        return {
            temperature: 0
        };
    }

    checkThresholds(metrics) {
        // Implementation
    }

    async generateReport() {
        const configuration = {
            type: 'line',
            data: {
                labels: this.metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
                datasets: [
                    {
                        label: 'CPU Load',
                        data: this.metrics.map(m => m.system.cpu),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgb(54, 162, 235)',
                        borderWidth: 1
                    },
                    {
                        label: 'Memory Usage',
                        data: this.metrics.map(m => m.system.memory.used),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        try {
            const image = await this.chartRenderer.renderToBuffer(configuration);
            return `data:image/png;base64,${image.toString('base64')}`;
        } catch (error) {
            logger.error('Error generating chart:', error);
            return null;
        }
    }
}

module.exports = new PerformanceMonitor();
