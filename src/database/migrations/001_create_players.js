const mongoose = require('mongoose');
const logger = require('../../utils/logger');

module.exports = {
    async up() {
        try {
            await mongoose.connection.createCollection('players');
            await mongoose.connection.collection('players').createIndexes([
                { key: { steamId: 1 }, unique: true },
                { key: { discordId: 1 }, sparse: true },
                { key: { online: 1 } }
            ]);
            logger.info('Players collection created successfully');
        } catch (error) {
            logger.error('Migration failed:', error);
            throw error;
        }
    },

    async down() {
        try {
            await mongoose.connection.dropCollection('players');
            logger.info('Players collection dropped successfully');
        } catch (error) {
            logger.error('Migration rollback failed:', error);
            throw error;
        }
    }
};
