const PlayerStats = require('../models/PlayerStats');
const { readGameData } = require('../utils/readGameData');
const logger = require('../utils/logger');

class PlayerSyncService {
    constructor() {
        this.syncInterval = null;
    }

    startSync() {
        this.syncInterval = setInterval(() => this.syncPlayerData(), 300000); // 5 minutes
        logger.info('Player sync service started');
    }

    async syncPlayerData() {
        try {
            const gameData = await readGameData();
            for (const [steamId, data] of Object.entries(gameData.players)) {
                await PlayerStats.upsert({
                    steamId,
                    lastSeen: new Date(),
                    ...this.transformGameData(data)
                });
            }
        } catch (error) {
            logger.error('Player sync failed:', error);
        }
    }

    transformGameData(data) {
        return {
            playtime: Math.floor(data.playtime / 60),
            zombieKills: data.stats.zombieKills,
            deaths: data.stats.deaths,
            level: data.level,
            experience: data.xp,
            reputation: data.reputation
        };
    }

    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            logger.info('Player sync service stopped');
        }
    }
}

module.exports = new PlayerSyncService();
