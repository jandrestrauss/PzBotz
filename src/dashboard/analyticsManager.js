const analyticsService = require('../analytics/analyticsService');
const gameEvents = require('../events/eventEmitter');

class AnalyticsDashboard {
    constructor() {
        this.metrics = {
            activeUsers: new Set(),
            commandUsage: new Map(),
            performance: []
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        gameEvents.on('userAction', (data) => {
            this.trackUserActivity(data);
        });

        gameEvents.on('performanceMetric', (data) => {
            this.metrics.performance.push({
                timestamp: Date.now(),
                ...data
            });
            this.pruneOldData();
        });
    }

    pruneOldData() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        this.metrics.performance = this.metrics.performance
            .filter(metric => metric.timestamp > oneDayAgo);
    }

    getAnalytics() {
        return {
            activeUsers: this.metrics.activeUsers.size,
            commandStats: Object.fromEntries(this.metrics.commandUsage),
            recentPerformance: this.metrics.performance.slice(-100)
        };
    }
}

module.exports = new AnalyticsDashboard();
