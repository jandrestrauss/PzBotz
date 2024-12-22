const { Pool } = require('pg');
const migrations = require('./migrations');

// ...existing code...

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const runMigrations = async () => {
  for (const migration of migrations) {
    const { id, up } = migration;
    const result = await pool.query('SELECT id FROM migrations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      await up(pool);
      await pool.query('INSERT INTO migrations (id) VALUES ($1)', [id]);
    }
  }
};

// ...existing code...

module.exports = { pool, runMigrations };
