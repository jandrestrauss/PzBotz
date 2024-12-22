const fs = require('fs').promises;
const yaml = require('js-yaml');
const logger = require('./utils/logger');

class ConfigManager {
    constructor() {
        this.config = {};
        this.configPath = process.env.CONFIG_PATH || './config.yml';
    }

    async loadConfig() {
        try {
            const fileContent = await fs.readFile(this.configPath, 'utf8');
            this.config = yaml.load(fileContent);
            return this.config;
        } catch (error) {
            logger.error('Failed to load config:', error);
            throw error;
        }
    }

    async saveConfig() {
        try {
            const yamlStr = yaml.dump(this.config);
            await fs.writeFile(this.configPath, yamlStr, 'utf8');
            logger.info('Configuration saved successfully');
        } catch (error) {
            logger.error('Failed to save config:', error);
            throw error;
        }
    }

    updateSetting(key, value) {
        const keys = key.split('.');
        let current = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return this.saveConfig();
    }
}

module.exports = new ConfigManager();