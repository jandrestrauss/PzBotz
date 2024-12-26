const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class ConfigManager {
    constructor() {
        this.configPath = path.join(process.cwd(), 'config', 'config.json');
        this.config = {};
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            }
        } catch (error) {
            logger.error('Failed to load configuration:', error);
        }
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            logger.error('Failed to save configuration:', error);
        }
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }
}

module.exports = new ConfigManager();
