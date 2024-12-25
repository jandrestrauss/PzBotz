module.exports = {
    port: process.env.DASHBOARD_PORT || 3000,
    metrics: {
        retention: {
            raw: '24h',
            aggregated: '30d'
        },
        intervals: {
            collection: '1m',
            aggregation: '5m'
        }
    },
    security: {
        rateLimit: {
            window: '15m',
            max: 100
        },
        session: {
            duration: '24h'
        }
    },
    features: {
        realtime: true,
        historicalData: true,
        alerts: true,
        commands: true
    }
};
