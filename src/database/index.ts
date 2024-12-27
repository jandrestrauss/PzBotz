import knex from 'knex';
import { logger } from '@utils/logger';
import type { DatabaseConfig } from '@types/index';

export const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10
  },
  debug: process.env.NODE_ENV === 'development'
});

export async function initializeDatabase(): Promise<void> {
  try {
    await db.raw('SELECT 1');
    logger.info('Database connection established');
    
    // Run migrations
    await db.migrate.latest();
    logger.info('Database migrations completed');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}
