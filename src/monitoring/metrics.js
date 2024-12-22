const { collectDefaultMetrics, Counter, Gauge } = require('prom-client');
const os = require('os');
const pool = require('../database/pool');

collectDefaultMetrics();

const metrics = {
    requestCounter: new Counter({
        name: 'http_requests_total',
        help: 'Total HTTP requests',
        labelNames: ['method', 'path', 'status']
    }),

    responseTime: new Gauge({
        name: 'http_response_time_seconds',
        help: 'HTTP response time in seconds',
        labelNames: ['method', 'path']
    }),

    serverStats: {
        cpuUsage: new Gauge({
            name: 'server_cpu_usage_percent',
            help: 'CPU usage percentage'
        }),
        memoryUsage: new Gauge({
            name: 'server_memory_usage_bytes',
            help: 'Memory usage in bytes'
        }),
        playerCount: new Gauge({
            name: 'server_player_count',
            help: 'Number of connected players'
        })
    }
};

const updateServerMetrics = () => {
    metrics.serverStats.cpuUsage.set(os.loadavg()[0] * 100);
    metrics.serverStats.memoryUsage.set(process.memoryUsage().heapUsed);
};

setInterval(updateServerMetrics, 15000);

const storeMetrics = async (metrics) => {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO metrics (timestamp, data) VALUES ($1, $2)', 
            [new Date(), JSON.stringify(metrics)]);
    } finally {
        client.release();
    }
};

module.exports = metrics;
