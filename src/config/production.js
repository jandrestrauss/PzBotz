module.exports = {
    server: {
        gameDir: process.env.GAME_DIR || 'C:/PZServer',
        backupDir: process.env.BACKUP_DIR || 'C:/PZServer/backups',
        maxBackups: 5,
        restartTime: '04:00',
        restartDays: ['MONDAY', 'THURSDAY']
    },
    database: {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    monitoring: {
        interval: 300000, // 5 minutes
        alertThresholds: {
            cpu: 80,
            memory: 90,
            diskSpace: 90
        }
    },
    discord: {
        commandPrefix: '!',
        adminRoles: ['Admin', 'Moderator'],
        statusChannel: process.env.STATUS_CHANNEL_ID,
        alertChannel: process.env.ALERT_CHANNEL_ID
    }
};
