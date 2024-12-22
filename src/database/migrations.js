const { Client } = require('pg');
const logger = require('../utils/logger');

async function runMigrations() {
    const client = new Client();
    try {
        await client.connect();
        logger.info('Connected to the database.');

        // Run your migration scripts here
        // Example:
        // await client.query('CREATE TABLE IF NOT EXISTS example_table (id SERIAL PRIMARY KEY, name VARCHAR(100));');

        logger.info('Migrations completed successfully.');
    } catch (error) {
        logger.error('Error running migrations:', error);
    } finally {
        await client.end();
    }
}

module.exports = { runMigrations };
