const { Pool } = require('pg');
const logger = require('../logging/logger');

class OptimizedQueries {
    constructor() {
        this.queryCache = new Map();
        this.statistics = new Map();
    }

    async executeQuery(query, params) {
        const start = Date.now();
        try {
            const result = await this.pool.query(query, params);
            this.updateStatistics(query, Date.now() - start);
            return result;
        } catch (error) {
            logger.logEvent(`Query error: ${error.message}`);
            throw error;
        }
    }

    updateStatistics(query, duration) {
        const stats = this.statistics.get(query) || { count: 0, totalTime: 0 };
        stats.count++;
        stats.totalTime += duration;
        this.statistics.set(query, stats);
    }
}

module.exports = new OptimizedQueries();
