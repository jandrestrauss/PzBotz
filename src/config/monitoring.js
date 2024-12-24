const monitoringConfig = {
    realtime: {
        enabled: true,
        interval: 5000,
        metrics: ['cpu', 'memory', 'network', 'errors'],
        alerts: {
            cpu: 80,
            memory: 85,
            errorRate: 5
        }
    },
    storage: {
        retention: '30d',
        aggregation: '5m'
    },
    reporting: {
        daily: true,
        weekly: true,
        recipients: ['admin@system.com']
    }
};

export default monitoringConfig;
