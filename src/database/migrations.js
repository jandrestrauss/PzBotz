const mongoose = require('mongoose');
const migrations = [
    async function migration1() {
        const User = mongoose.model('User');
        await User.updateMany({}, { $set: { isActive: true } });
    },
];

async function runMigrations() {
    for (const migration of migrations) {
        await migration();
    }
    console.log('Migrations completed successfully.');
}

const migrateDatabase = async () => {
  await createTables();
  await seedInitialData();
};

const createTables = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const seedInitialData = async () => {
  await db.query(`
    INSERT INTO users (username, password) VALUES
    ('admin', 'admin_password');
  `);
};

migrateDatabase().catch(console.error);

module.exports = { runMigrations };
