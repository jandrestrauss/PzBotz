const { Pool } = require('pg');
const metrics = require('../monitoring/metrics');

class DatabaseOptimizer {
    constructor() {
        this.queries = new Map();
        this.QUERY_THRESHOLD = 100;
        this.setupMetrics();
    }

    setupMetrics() {
        setInterval(() => this.analyzeQueryPatterns(), 300000);
    }

    async analyzeQueryPatterns() {
        const slowQueries = Array.from(this.queries.entries())
            .filter(([_, stats]) => stats.avgTime > this.QUERY_THRESHOLD);
        
        if (slowQueries.length > 0) {
            await this.optimizeQueries(slowQueries);
        }
    }

    trackQuery(query, executionTime) {
        const stats = this.queries.get(query) || { count: 0, totalTime: 0 };
        stats.count++;
        stats.totalTime += executionTime;
        stats.avgTime = stats.totalTime / stats.count;
        this.queries.set(query, stats);
    }
}

module.exports = new DatabaseOptimizer();
