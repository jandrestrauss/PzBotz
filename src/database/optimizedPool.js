const { Pool } = require('pg');
const metrics = require('../monitoring/metrics');

class OptimizedPool {
    constructor() {
        this.pool = new Pool({
            max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            maxUses: 7500 // Prevent memory leaks
        });

        this.setupPoolMonitoring();
    }

    setupPoolMonitoring() {
        this.pool.on('connect', (client) => {
            metrics.dbConnections.inc();
        });

        this.pool.on('remove', (client) => {
            metrics.dbConnections.dec();
        });
    }

    async query(text, params) {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            metrics.dbQueryDuration.observe(Date.now() - start);
            return result;
        } catch (error) {
            metrics.dbErrors.inc();
            throw error;
        }
    }
}

module.exports = new OptimizedPool();
