const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class ConfigManager {
    constructor() {
        this.configFile = path.join(__dirname, '../../config/config.json');
        this.config = {};
    }

    async loadConfig() {
        try {
            const data = await fs.readFile(this.configFile, 'utf8');
            this.config = JSON.parse(data);
            logger.logEvent('Config loaded');
        } catch (error) {
            logger.logEvent(`Failed to load config: ${error.message}`);
            throw error;
        }
    }

    async saveConfig(newConfig) {
        try {
            this.config = { ...this.config, ...newConfig };
            await fs.writeFile(this.configFile, JSON.stringify(this.config, null, 2));
            logger.logEvent('Config saved');
        } catch (error) {
            logger.logEvent(`Failed to save config: ${error.message}`);
            throw error;
        }
    }

    getConfig() {
        return this.config;
    }
}

module.exports = new ConfigManager();
