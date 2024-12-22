const { DataTypes } = require('sequelize');
const database = require('../database');

class ServerStats {
    constructor() {
        this.Stats = database.sequelize.define('ServerStats', {
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            playerCount: DataTypes.INTEGER,
            cpuUsage: DataTypes.FLOAT,
            memoryUsage: DataTypes.FLOAT,
            tickRate: DataTypes.FLOAT
        });
    }

    async logStats(stats) {
        try {
            await this.Stats.create(stats);
        } catch (error) {
            logger.error('Failed to log server stats:', error);
        }
    }

    async getOverviewStats() {
        const currentStats = await this.getCurrentStats();
        const historicalStats = await this.getHistoricalStats();
        return {
            current: currentStats,
            historical: historicalStats
        };
    }
}

module.exports = new ServerStats();
