const { DataTypes } = require('sequelize');
const database = require('../database');
const logger = require('../utils/logger');

class EconomySystem {
    constructor() {
        this.setupDatabase();
    }

    async setupDatabase() {
        this.PlayerBalance = database.sequelize.define('PlayerBalance', {
            playerId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            balance: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            lastTransaction: DataTypes.DATE
        });

        await this.PlayerBalance.sync();
    }

    async getBalance(playerId) {
        try {
            const record = await this.PlayerBalance.findByPk(playerId);
            return record?.balance || 0;
        } catch (error) {
            logger.error(`Failed to get balance for player ${playerId}:`, error);
            return 0;
        }
    }

    async addFunds(playerId, amount) {
        const transaction = await database.sequelize.transaction();
        try {
            await this.PlayerBalance.upsert({
                playerId,
                balance: database.sequelize.literal(`balance + ${amount}`),
                lastTransaction: new Date()
            }, { transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            logger.error(`Failed to add funds for player ${playerId}:`, error);
            return false;
        }
    }
}

module.exports = new EconomySystem();
