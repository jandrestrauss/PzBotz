const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const healthCheck = require('./healthCheck');
const alertSystem = require('./alertSystem');

class MetricsReporter {
    constructor() {
        this.metricsPath = path.join(process.cwd(), 'data', 'metrics');
        this.currentMetrics = {
            server: {},
            players: {},
            performance: {}
        };
        this.interval = null;
    }

    start() {
        this.createMetricsDirectory();
        this.interval = setInterval(() => this.collectMetrics(), 60000);
        logger.logEvent('Metrics reporter started');
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async collectMetrics() {
        try {
            const health = await healthCheck.check();
            const timestamp = new Date();

            this.currentMetrics = {
                timestamp,
                server: {
                    uptime: process.uptime(),
                    ...health.system
                },
                performance: {
                    ...health.process
                },
                players: {
                    // Add player metrics here
                }
            };

            await this.saveMetrics();
            this.checkThresholds();
        } catch (error) {
            logger.error('Failed to collect metrics:', error);
        }
    }

    createMetricsDirectory() {
        if (!fs.existsSync(this.metricsPath)) {
            fs.mkdirSync(this.metricsPath, { recursive: true });
        }
    }

    async saveMetrics() {
        const date = new Date().toISOString().split('T')[0];
        const filePath = path.join(this.metricsPath, `metrics_${date}.json`);

        try {
            let metrics = [];
            if (fs.existsSync(filePath)) {
                metrics = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
            
            metrics.push(this.currentMetrics);
            fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2));
        } catch (error) {
            logger.error('Failed to save metrics:', error);
        }
    }

    checkThresholds() {
        const { server, performance } = this.currentMetrics;
        
        if (server.cpuLoad > 80) {
            alertSystem.sendAlert('WARNING', 'High CPU Usage', 
                `CPU usage is at ${server.cpuLoad}%`, { cpuLoad: server.cpuLoad });
        }

        if (performance.heapUsed / performance.heapTotal > 0.9) {
            alertSystem.sendAlert('WARNING', 'High Memory Usage',
                'Memory usage is above 90%', { memory: performance.heapUsed });
        }
    }

    getMetrics(timeframe) {
        // Implementation for getting historical metrics
    }
}

module.exports = new MetricsReporter();
