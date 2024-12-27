import { config } from 'dotenv';
import type { Knex } from 'knex';

config();

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default knexConfig;
