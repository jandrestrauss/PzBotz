const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const statisticsVisualizer = require('../utils/statisticsVisualizer');
const metricsReporter = require('./metricsReporter');

class ReportGenerator {
    constructor() {
        this.reportsPath = path.join(process.cwd(), 'data', 'reports');
        if (!fs.existsSync(this.reportsPath)) {
            fs.mkdirSync(this.reportsPath, { recursive: true });
        }
    }

    async generateDailyReport() {
        const date = new Date().toISOString().split('T')[0];
        const metrics = await metricsReporter.getDailyMetrics();
        
        const report = {
            date,
            serverMetrics: {
                uptime: metrics.uptime,
                averageCpu: this.calculateAverage(metrics.cpu),
                averageMemory: this.calculateAverage(metrics.memory),
                peakPlayers: Math.max(...metrics.players)
            },
            events: await this.getEventsSummary(),
            charts: await this.generateCharts(metrics)
        };

        await this.saveReport(date, report);
        return report;
    }

    async generateCharts(metrics) {
        const charts = [];
        try {
            const performanceChart = await statisticsVisualizer.generateServerStatsChart(metrics);
            charts.push({
                name: 'performance',
                data: performanceChart
            });
        } catch (error) {
            logger.error('Failed to generate charts:', error);
        }
        return charts;
    }

    calculateAverage(numbers) {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    async getEventsSummary() {
        // Implementation for event summary
        return {};
    }

    async saveReport(date, report) {
        const filename = `report_${date}.json`;
        const filepath = path.join(this.reportsPath, filename);
        
        try {
            await fs.promises.writeFile(filepath, JSON.stringify(report, null, 2));
            logger.logEvent(`Report generated: ${filename}`);
        } catch (error) {
            logger.error('Failed to save report:', error);
            throw error;
        }
    }
}

module.exports = new ReportGenerator();
