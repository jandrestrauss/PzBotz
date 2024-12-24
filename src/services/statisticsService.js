const fs = require('fs');
const path = require('path');
const { PerformanceMonitor } = require('../utils/performance');
const logger = require('../utils/logger');
const db = require('../database/database');

class StatisticsService {
    constructor() {
        this.statsPath = path.join(process.cwd(), 'data', 'statistics.json');
        this.stats = {
            serverUptime: 0,
            totalPlayers: 0,
            peakPlayers: 0,
            restarts: 0,
            crashes: 0,
            lastUpdate: null,
            dailyStats: {}
        };
        this.loadStats();
        this.startCollecting();
    }

    loadStats() {
        try {
            if (fs.existsSync(this.statsPath)) {
                this.stats = JSON.parse(fs.readFileSync(this.statsPath, 'utf8'));
            }
        } catch (error) {
            logger.error('Failed to load statistics:', error);
        }
    }

    saveStats() {
        try {
            fs.mkdirSync(path.dirname(this.statsPath), { recursive: true });
            fs.writeFileSync(this.statsPath, JSON.stringify(this.stats, null, 2));
        } catch (error) {
            logger.error('Failed to save statistics:', error);
        }
    }

    updateStats(type, value) {
        const today = new Date().toISOString().split('T')[0];
        if (!this.stats.dailyStats[today]) {
            this.stats.dailyStats[today] = {
                players: 0,
                peakPlayers: 0,
                restarts: 0,
                crashes: 0
            };
        }

        switch (type) {
            case 'players':
                this.stats.totalPlayers += value;
                this.stats.dailyStats[today].players += value;
                this.updatePeakPlayers(value);
                break;
            case 'restart':
                this.stats.restarts++;
                this.stats.dailyStats[today].restarts++;
                break;
            case 'crash':
                this.stats.crashes++;
                this.stats.dailyStats[today].crashes++;
                break;
        }

        this.stats.lastUpdate = new Date().toISOString();
        this.saveStats();
    }

    updatePeakPlayers(currentPlayers) {
        const today = new Date().toISOString().split('T')[0];
        if (currentPlayers > this.stats.peakPlayers) {
            this.stats.peakPlayers = currentPlayers;
        }
        if (currentPlayers > this.stats.dailyStats[today].peakPlayers) {
            this.stats.dailyStats[today].peakPlayers = currentPlayers;
        }
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

    getStats() {
        return this.stats;
    }

    getDailyStats(date = new Date().toISOString().split('T')[0]) {
        return this.stats.dailyStats[date] || null;
    }
}

module.exports = new StatisticsService();
