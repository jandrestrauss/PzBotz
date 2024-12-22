const { Client } = require('pg');
const logger = require('../utils/logger');

const migrations = [
  {
    id: '20231001_create_users_table',
    up: async (db) => {
      await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    },
    down: async (db) => {
      await db.query(`DROP TABLE users;`);
    }
  },
  {
    id: '20231002_create_points_table',
    up: async (db) => {
      await db.query(`
        CREATE TABLE points (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          points INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    },
    down: async (db) => {
      await db.query(`DROP TABLE points;`);
    }
  },
  // Add more migrations as needed
];

async function runMigrations() {
    const client = new Client();
    try {
        await client.connect();
        logger.info('Connected to the database.');

        for (const migration of migrations) {
            await migration.up(client);
            logger.info(`Migration ${migration.id} applied successfully.`);
        }

        logger.info('Migrations completed successfully.');
    } catch (error) {
        logger.error('Error running migrations:', error);
    } finally {
        await client.end();
    }
}

module.exports = { runMigrations, migrations };
