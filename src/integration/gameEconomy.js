const logger = require('../utils/logger');
const { readGameData } = require('../utils/gameFiles');

class GameEconomyIntegration {
    constructor() {
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
        this.cachedData = null;
        this.lastUpdate = 0;
    }

    async getPlayerPoints(steamId) {
        try {
            const gameData = await this.fetchGameEconomyData();
            return gameData.playerPoints[steamId] || 0;
        } catch (error) {
            logger.error('Failed to get player points:', error);
            return 0;
        }
    }

    async fetchGameEconomyData() {
        if (this.isCacheValid()) {
            return this.cachedData;
        }

        try {
            const data = await readGameData(process.env.GAME_ECONOMY_FILE);
            this.cachedData = data;
            this.lastUpdate = Date.now();
            return data;
        } catch (error) {
            logger.error('Failed to fetch game economy data:', error);
            throw error;
        }
    }

    isCacheValid() {
        return this.cachedData && (Date.now() - this.lastUpdate < this.cacheDuration);
    }

    async transferPoints(fromSteamId, toSteamId, amount) {
        const transaction = await database.sequelize.transaction();
        try {
            const fromBalance = await this.getPlayerPoints(fromSteamId);
            if (fromBalance < amount) {
                await transaction.rollback();
                return false;
            }

            await this.updatePoints(fromSteamId, -amount, transaction);
            await this.updatePoints(toSteamId, amount, transaction);
            await this.logTransfer(fromSteamId, toSteamId, amount, transaction);
            
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            logger.error('Transfer failed:', error);
            return false;
        }
    }

    async updatePoints(steamId, amount, transaction) {
        await database.sequelize.query(
            'UPDATE player_points SET points = points + ? WHERE steam_id = ?',
            {
                replacements: [amount, steamId],
                transaction
            }
        );
    }

    async logTransfer(fromId, toId, amount, transaction) {
        await database.sequelize.models.PointTransfers.create({
            fromSteamId: fromId,
            toSteamId: toId,
            amount: amount,
            timestamp: new Date()
        }, { transaction });
    }
}

module.exports = new GameEconomyIntegration();
