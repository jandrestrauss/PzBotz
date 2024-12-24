const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const systemStats = require('../monitoring/systemStats');

class PerformanceReport {
    constructor() {
        this.reportPath = path.join(process.cwd(), 'reports');
        this.stats = [];
        this.maxStats = 1440; // Store 24 hours of data at 1-minute intervals
    }

    initialize() {
        if (!fs.existsSync(this.reportPath)) {
            fs.mkdirSync(this.reportPath);
        }

        systemStats.on('stats', (stats) => {
            this.recordStats(stats);
        });
    }

    recordStats(stats) {
        this.stats.push({
            ...stats,
            timestamp: new Date()
        });

        if (this.stats.length > this.maxStats) {
            this.stats.shift();
        }
    }

    generateReport() {
        const now = new Date();
        const report = {
            timestamp: now.toISOString(),
            summary: this.generateSummary(),
            alerts: this.getAlertCount(),
            hourlyStats: this.generateHourlyStats(),
            recommendations: this.generateRecommendations()
        };

        const filename = `performance-${now.toISOString().replace(/[:.]/g, '-')}.json`;
        const filepath = path.join(this.reportPath, filename);

        try {
            fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
            logger.logEvent(`Performance report generated: ${filename}`);
            return report;
        } catch (error) {
            logger.error('Failed to generate performance report:', error);
            throw error;
        }
    }

    generateSummary() {
        const recentStats = this.stats.slice(-60); // Last hour
        return {
            averageCpu: this.average(recentStats.map(s => s.cpu)),
            averageMemory: this.average(recentStats.map(s => s.memory)),
            peakCpu: Math.max(...recentStats.map(s => s.cpu)),
            peakMemory: Math.max(...recentStats.map(s => s.memory)),
            averagePlayers: this.average(recentStats.map(s => s.players))
        };
    }

    generateHourlyStats() {
        // Implementation for hourly statistics
    }

    generateRecommendations() {
        const summary = this.generateSummary();
        const recommendations = [];

        if (summary.averageCpu > 70) {
            recommendations.push('Consider upgrading CPU resources');
        }
        if (summary.averageMemory > 80) {
            recommendations.push('Memory usage is high - consider increasing allocated memory');
        }
        if (summary.peakCpu > 90) {
            recommendations.push('CPU experiencing high peak loads - investigate potential bottlenecks');
        }

        return recommendations;
    }

    average(numbers) {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }
}

module.exports = new PerformanceReport();
