const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class BaseService extends EventEmitter {
    constructor(name, configFile = null) {
        super();
        this.name = name;
        this.configPath = configFile ? path.join(process.cwd(), 'config', configFile) : null;
        this.data = new Map();
    }

    async loadConfig() {
        if (!this.configPath) return;
        
        try {
            if (fs.existsSync(this.configPath)) {
                const data = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                this.data.clear();
                if (Array.isArray(data)) {
                    data.forEach(item => this.data.set(item.id || item.name, item));
                } else {
                    Object.entries(data).forEach(([key, value]) => this.data.set(key, value));
                }
            }
        } catch (error) {
            logger.error(`Failed to load config for ${this.name}:`, error);
        }
    }

    async saveConfig() {
        if (!this.configPath) return;

        try {
            const data = Array.from(this.data.values());
            fs.writeFileSync(this.configPath, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error(`Failed to save config for ${this.name}:`, error);
        }
    }

    async start() {
        await this.loadConfig();
        logger.logEvent(`${this.name} service started`);
    }

    async stop() {
        await this.saveConfig();
        logger.logEvent(`${this.name} service stopped`);
    }
}

module.exports = BaseService;
