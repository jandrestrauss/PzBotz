module.exports = {
    bot: {
        prefix: '!',
        defaultLocale: 'en',
        commandTimeout: 5000,
        maxHistorySize: 100
    },

    server: {
        host: process.env.PZ_SERVER_HOST,
        rconPort: parseInt(process.env.PZ_SERVER_RCON_PORT),
        rconPassword: process.env.PZ_SERVER_RCON_PASSWORD,
        serverPath: process.env.PZ_SERVER_PATH,
        maxPlayers: 32,
        backupInterval: 1440,
        restartSchedule: ['04:00', '16:00'],
        modUpdateCheck: 3600
    },

    monitoring: {
        enabled: true,
        interval: 300,
        thresholds: {
            cpu: 80,
            memory: 85,
            disk: 90,
            players: 32
        },
        alerts: {
            discord: true,
            email: false
        }
    },

    rateLimits: {
        commands: {
            points: 20,
            duration: 60,
            blockDuration: 60
        },
        api: {
            points: 100,
            duration: 300,
            blockDuration: 600
        },
        wheel: {
            points: 3,
            duration: 3600,
            blockDuration: 1800
        }
    },

    features: {
        dashboard: process.env.ENABLE_DASHBOARD === 'true',
        websocket: process.env.ENABLE_WEBSOCKET === 'true',
        database: process.env.ENABLE_DATABASE === 'true',
        cache: true
    },

    rewards: {
        ticketPrice: 500,
        dailyLimit: 3,
        pointsExpiry: 30,
        wheelTypes: ['default', 'premium']
    },

    logging: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        retention: 7,
        compress: true
    }
};
