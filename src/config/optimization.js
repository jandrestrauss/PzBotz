const optimizationConfig = {
    autoOptimize: true,
    thresholds: {
        cpu: {
            warning: 70,
            critical: 85,
            action: 'scale'
        },
        memory: {
            warning: 75,
            critical: 90,
            action: 'cleanup'
        },
        responseTime: {
            warning: 1000,
            critical: 2000,
            action: 'cache'
        }
    },
    schedule: {
        analysis: '*/15 * * * *',
        optimization: '0 * * * *'
    }
};

export default optimizationConfig;
