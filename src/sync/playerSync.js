const logger = require('../utils/logger');
const database = require('../database');
const gameEconomy = require('../integration/gameEconomy');

class PlayerSync {
    constructor() {
        this.syncInterval = null;
        this.lastSync = null;
    }

    async startSync() {
        this.syncInterval = setInterval(async () => {
            try {
                await this.synchronizePlayerData();
                this.lastSync = new Date();
                logger.info('Player data synchronization completed');
            } catch (error) {
                logger.error('Player sync failed:', error);
            }
        }, 5 * 60 * 1000); // Every 5 minutes
    }

    async synchronizePlayerData() {
        const gameData = await gameEconomy.fetchGameEconomyData();
        const transaction = await database.sequelize.transaction();
        
        try {
            for (const [steamId, data] of Object.entries(gameData.players)) {
                await this.updatePlayerRecord(steamId, data, transaction);
            }
            
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updatePlayerRecord(steamId, data, transaction) {
        await database.sequelize.models.PlayerStats.upsert({
            steamId,
            lastSeen: new Date(),
            ...data
        }, { transaction });
    }

    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
}

module.exports = new PlayerSync();
