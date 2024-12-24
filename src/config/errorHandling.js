const errorConfig = {
    reporting: {
        levels: ['warning', 'error', 'critical'],
        threshold: {
            warning: 5,
            error: 10,
            critical: 20
        },
        retention: '7d'
    },
    recovery: {
        autoRecover: true,
        maxAttempts: 3,
        backoffMs: 1000
    },
    notification: {
        channels: ['slack', 'email'],
        throttle: '5m'
    }
};

export default errorConfig;
