module.exports = {
    performance: {
        // ...existing performance config...
    },
    security: {
        rateLimit: {
            window: 60000,
            max: 30,
            blacklistDuration: 3600000
        },
        tokens: {
            rotation: true,
            rotationInterval: 2592000000, // 30 days
            algorithm: 'aes-256-gcm'
        }
    },
    monitoring: {
        metrics: {
            enabled: true,
            interval: 30000,
            retention: 604800000 // 7 days
        },
        alerts: {
            discord: true,
            console: true,
            log: true
        }
    },
    recovery: {
        autoRestart: true,
        maxAttempts: 3,
        backoff: {
            initial: 5000,
            max: 300000,
            factor: 2
        }
    }
};
