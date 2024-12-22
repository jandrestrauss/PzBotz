const { Pool } = require('pg');
const metrics = require('../monitoring/advancedMetrics');

class DatabasePool {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        });

        this.setupPoolMonitoring();
    }

    setupPoolMonitoring() {
        this.pool.on('connect', () => {
            metrics.metrics.application.set('dbConnections', 
                (metrics.metrics.application.get('dbConnections') || 0) + 1
            );
        });

        this.pool.on('remove', () => {
            metrics.metrics.application.set('dbConnections',
                (metrics.metrics.application.get('dbConnections') || 1) - 1
            );
        });
    }
}

module.exports = new DatabasePool();
