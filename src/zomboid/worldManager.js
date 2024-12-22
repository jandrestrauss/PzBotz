const fs = require('fs').promises;
const path = require('path');
const logger = require('../logging/logger');

class WorldManager {
    constructor() {
        this.savePath = process.env.SAVES_PATH;
        this.backupPath = process.env.BACKUP_PATH;
    }

    async backupWorld(worldName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const worldPath = path.join(this.savePath, worldName);
        const backupFile = path.join(this.backupPath, `${worldName}_${timestamp}.zip`);

        try {
            logger.logEvent(`Backing up world: ${worldName}`);
            await this.createWorldBackup(worldPath, backupFile);
            return backupFile;
        } catch (error) {
            logger.logEvent(`World backup failed: ${error.message}`);
            throw error;
        }
    }

    async getWorldInfo(worldName) {
        const configPath = path.join(this.savePath, worldName, 'server-info.txt');
        const data = await fs.readFile(configPath, 'utf8');
        return this.parseWorldInfo(data);
    }
}

module.exports = new WorldManager();
