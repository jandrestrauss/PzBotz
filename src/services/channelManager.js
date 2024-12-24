const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class ChannelManager {
    constructor() {
        this.configPath = path.join(process.cwd(), 'config', 'channels.json');
        this.channels = {
            command: null,
            public: null,
            log: null
        };
        this.loadChannels();
    }

    loadChannels() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.channels = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            }
        } catch (error) {
            logger.error('Error loading channel configuration:', error);
        }
    }

    saveChannels() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.channels, null, 2));
        } catch (error) {
            logger.error('Error saving channel configuration:', error);
        }
    }

    setChannel(type, channelId) {
        if (type in this.channels) {
            this.channels[type] = channelId;
            this.saveChannels();
            return true;
        }
        return false;
    }

    getChannel(type) {
        return this.channels[type];
    }

    isConfigured() {
        return Object.values(this.channels).every(channel => channel !== null);
    }
}

module.exports = new ChannelManager();
