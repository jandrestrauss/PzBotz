const { exec } = require('child_process');
const { PerformanceMonitor } = require('../utils/performance');
const logger = require('../logging/logger');

class ZomboidServer {
    constructor() {
        this.config = {
            serverPath: process.env.ZOMBOID_SERVER_PATH,
            maxPlayers: process.env.MAX_PLAYERS || 32,
            serverMemory: process.env.SERVER_MEMORY || '4G',
            modIds: process.env.MOD_IDS?.split(',') || []
        };
        this.status = 'stopped';
    }

    async start() {
        const stopTimer = PerformanceMonitor.startTimer('serverStart');
        try {
            const command = this.buildStartCommand();
            this.process = exec(command);
            this.setupProcessHandlers();
            logger.logEvent('Zomboid server starting');
        } finally {
            stopTimer();
        }
    }

    buildStartCommand() {
        return `cd "${this.config.serverPath}" && ` +
               `start-server.bat -servername "PZServer" ` +
               `-adminpassword "${process.env.ADMIN_PASSWORD}" ` +
               `-memory ${this.config.serverMemory} ` +
               `${this.config.modIds.map(id => `-mod mod_${id}`).join(' ')}`;
    }
}

module.exports = new ZomboidServer();
