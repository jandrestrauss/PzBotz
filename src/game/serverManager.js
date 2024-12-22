const { spawn } = require('child_process');
const path = require('path');
const systemIntegration = require('../integration/systemIntegration');
const logger = require('../utils/logger');

class GameServerManager {
    constructor() {
        this.process = null;
        this.status = 'stopped';
        this.config = {
            maxMemory: process.env.SERVER_MAX_MEMORY || '4G',
            backupInterval: process.env.BACKUP_INTERVAL || '6h'
        };
        
        systemIntegration.registerSystem('gameServer', this);
    }

    async start() {
        if (this.status === 'running') return;
        
        try {
            this.process = spawn('java', [
                `-Xmx${this.config.maxMemory}`,
                '-jar', 'server.jar',
                'nogui'
            ], {
                cwd: process.env.SERVER_DIR
            });
            
            this.setupProcessHandlers();
            this.status = 'running';
            logger.info('Game server started');
        } catch (error) {
            logger.error('Failed to start game server:', error);
            throw error;
        }
    }

    async checkHealth() {
        return this.status;
    }
}

module.exports = new GameServerManager();
