const { exec } = require('child_process');
const logger = require('../utils/logger');
const config = require('../config');

class MaintenanceSystem {
    constructor() {
        this.isInMaintenance = false;
        this.scheduledTasks = new Map();
    }

    async scheduleRestart(time) {
        const taskId = setTimeout(async () => {
            await this.performServerRestart();
        }, time);
        
        this.scheduledTasks.set('restart', taskId);
        logger.info(`Server restart scheduled for ${new Date(Date.now() + time)}`);
    }

    async performServerRestart() {
        try {
            this.isInMaintenance = true;
            await this.broadcastWarning('Server restart in 5 minutes');
            await this.saveAllPlayers();
            await this.executeRestart();
            this.isInMaintenance = false;
        } catch (error) {
            logger.error('Server restart failed:', error);
            this.isInMaintenance = false;
        }
    }

    async executeRestart() {
        return new Promise((resolve, reject) => {
            exec(config.get('server.restartCommand'), (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }
}

module.exports = new MaintenanceSystem();
