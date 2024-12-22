const mongoose = require('mongoose');
const logger = require('../utils/logger');

const migrations = [
    async function migration1() {
        const User = mongoose.model('User');
        await User.updateMany({}, { $set: { isActive: true } });
    },
    // Add more migrations as needed
];

async function runMigrations() {
    for (const migration of migrations) {
        await migration();
    }
    logger.info('Migrations completed successfully.');
}

module.exports = { runMigrations };
