const { DataTypes } = require('sequelize');
const database = require('./database');
const logger = require('./utils/logger');

class PlayerStats {
    constructor() {
        this.stats = database.sequelize.define('PlayerStats', {
            playerId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            playtime: DataTypes.INTEGER,
            zombiesKilled: DataTypes.INTEGER,
            deaths: DataTypes.INTEGER,
            lastSeen: DataTypes.DATE,
            survivedDays: DataTypes.INTEGER
        });
    }

    async updateStats(playerId, stats) {
        try {
            await this.stats.upsert({
                playerId,
                ...stats,
                lastSeen: new Date()
            });
        } catch (error) {
            logger.error(`Failed to update stats for player ${playerId}:`, error);
        }
    }

    async getPlayerStats(playerId) {
        try {
            return await this.stats.findByPk(playerId);
        } catch (error) {
            logger.error(`Failed to get stats for player ${playerId}:`, error);
            return null;
        }
    }

    async getLeaderboard(category, limit = 10) {
        try {
            return await this.stats.findAll({
                order: [[category, 'DESC']],
                limit
            });
        } catch (error) {
            logger.error(`Failed to get leaderboard for ${category}:`, error);
            return [];
        }
    }
}

module.exports = new PlayerStats();
