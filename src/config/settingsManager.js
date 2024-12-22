const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class SettingsManager {
    constructor() {
        this.settingsFile = path.join(__dirname, '../../config/settings.json');
        this.settings = {};
    }

    async loadSettings() {
        try {
            const data = await fs.readFile(this.settingsFile, 'utf8');
            this.settings = JSON.parse(data);
            logger.logEvent('Settings loaded');
        } catch (error) {
            logger.logEvent(`Failed to load settings: ${error.message}`);
            throw error;
        }
    }

    async saveSettings(newSettings) {
        try {
            this.settings = { ...this.settings, ...newSettings };
            await fs.writeFile(this.settingsFile, JSON.stringify(this.settings, null, 2));
            logger.logEvent('Settings saved');
        } catch (error) {
            logger.logEvent(`Failed to save settings: ${error.message}`);
            throw error;
        }
    }

    getSettings() {
        return this.settings;
    }
}

module.exports = new SettingsManager();
