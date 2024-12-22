const fs = require('fs').promises;
const path = require('path');
const logger = require('../logging/logger');

class ConfigManager {
    constructor() {
        this.configFiles = {
            server: 'servertest.ini',
            spawnRegions: 'spawnregions.lua',
            sandbox: 'sandbox-options.ini'
        };
    }

    async readServerConfig() {
        try {
            const configPath = path.join(process.env.ZOMBOID_SERVER_PATH, this.configFiles.server);
            const config = await fs.readFile(configPath, 'utf8');
            return this.parseConfig(config);
        } catch (error) {
            logger.logEvent(`Failed to read server config: ${error.message}`);
            throw error;
        }
    }

    async updateSandboxOptions(options) {
        // Only update specific sandbox settings, leave others at default
        // ...
    }
}

module.exports = new ConfigManager();
