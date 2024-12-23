const config = {
    interval: process.env.METRICS_INTERVAL || 60000,
    retentionDays: process.env.METRICS_RETENTION_DAYS || 30,
    alerts: {
        cpu: 80,
        memory: 85,
        disk: 90
    },
    logging: {
        enabled: true,
        path: './logs/metrics'
    },
    metrics: {
        enabled: true,
        endpoint: process.env.METRICS_ENDPOINT || 'http://localhost:9090'
    }
};

module.exports = config;
