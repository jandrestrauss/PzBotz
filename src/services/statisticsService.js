const { PerformanceMonitor } = require('../utils/performance');
const logger = require('../utils/logger');
const db = require('../database/database');

class StatisticsService {
    constructor() {
        this.stats = new Map();
        this.startCollecting();
    }

    startCollecting() {
        setInterval(async () => {
            const serverStats = await this.collectServerStats();
            const playerStats = await this.collectPlayerStats();
            
            await this.saveStats({
                timestamp: Date.now(),
                server: serverStats,
                players: playerStats
            });
        }, 300000); // Every 5 minutes
    }

    async getStatistics(timeframe) {
        const stopTimer = PerformanceMonitor.startTimer('getStats');
        try {
            return await db.collection('statistics')
                .find({ timestamp: { $gte: Date.now() - timeframe } })
                .toArray();
        } finally {
            stopTimer();
        }
    }
}

module.exports = new StatisticsService();
