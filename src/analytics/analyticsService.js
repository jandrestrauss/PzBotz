const { serverStats } = require('../monitoring/metrics');
const pool = require('../database/pool');

class AnalyticsService {
    constructor() {
        this.cache = new Map();
        this.flushInterval = 300000; // 5 minutes
        this.startFlushTimer();
    }

    trackEvent(eventName, data) {
        const event = {
            timestamp: Date.now(),
            eventName,
            data,
            metrics: {
                cpu: serverStats.cpuUsage.get(),
                memory: serverStats.memoryUsage.get(),
                players: serverStats.playerCount.get()
            }
        };

        this.cache.set(Date.now(), event);
    }

    async flushEvents() {
        if (this.cache.size === 0) return;

        const events = Array.from(this.cache.values());
        this.cache.clear();

        await pool.query(
            'INSERT INTO analytics (timestamp, data) VALUES ($1, $2)',
            [new Date(), JSON.stringify(events)]
        );
    }

    startFlushTimer() {
        setInterval(() => this.flushEvents(), this.flushInterval);
    }
}

module.exports = new AnalyticsService();
