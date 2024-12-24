const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const channelManager = require('./channelManager');

class DeathMessageHandler {
    constructor() {
        this.deathLogPath = path.join(process.cwd(), 'Zomboid', 'Logs', 'deaths.txt');
        this.lastPosition = 0;
        this.messages = require('../../config/death_messages.json');
    }

    startWatching(client) {
        if (!fs.existsSync(this.deathLogPath)) {
            logger.error('Death log file not found');
            return;
        }

        this.lastPosition = fs.statSync(this.deathLogPath).size;
        
        fs.watch(this.deathLogPath, (eventType) => {
            if (eventType === 'change') {
                this.processNewDeaths(client);
            }
        });
    }

    async processNewDeaths(client) {
        const content = fs.readFileSync(this.deathLogPath, 'utf8');
        const newContent = content.slice(this.lastPosition);
        this.lastPosition = content.length;

        if (!newContent) return;

        const deaths = this.parseDeathLog(newContent);
        await this.announceDeaths(deaths, client);
    }

    parseDeathLog(content) {
        const deathRegex = /(\w+) (died|was killed) by (.+)/g;
        const deaths = [];
        let match;

        while ((match = deathRegex.exec(content)) !== null) {
            deaths.push({
                player: match[1],
                cause: match[3]
            });
        }

        return deaths;
    }

    async announceDeaths(deaths, client) {
        const channelId = channelManager.getChannel('log');
        if (!channelId) return;

        const channel = await client.channels.fetch(channelId);
        if (!channel) return;

        for (const death of deaths) {
            const message = this.getRandomDeathMessage(death.player, death.cause);
            await channel.send(message);
        }
    }

    getRandomDeathMessage(player, cause) {
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        return message.replace('{player}', player).replace('{cause}', cause);
    }
}

module.exports = new DeathMessageHandler();
