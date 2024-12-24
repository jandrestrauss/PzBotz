const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { Client } = require('discord.js');

class DeathMessageService {
    constructor() {
        this.messagesPath = path.join(process.cwd(), 'config', 'death_messages.json');
        this.messages = [];
        this.deathLogPath = path.join(process.cwd(), 'Zomboid', 'Logs', 'deaths.txt');
        this.loadMessages();
    }

    loadMessages() {
        try {
            if (fs.existsSync(this.messagesPath)) {
                this.messages = JSON.parse(fs.readFileSync(this.messagesPath, 'utf8'));
            }
        } catch (error) {
            logger.error('Error loading death messages:', error);
        }
    }

    getRandomMessage(playerName, causeOfDeath) {
        if (this.messages.length === 0) return `${playerName} has died from ${causeOfDeath}`;
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        return message.replace('{player}', playerName).replace('{cause}', causeOfDeath);
    }

    watchDeathLog(channelId, client) {
        fs.watchFile(this.deathLogPath, async (curr, prev) => {
            if (curr.mtime > prev.mtime) {
                try {
                    const content = fs.readFileSync(this.deathLogPath, 'utf8');
                    const newDeaths = this.parseNewDeaths(content);
                    await this.announceDeaths(newDeaths, channelId, client);
                } catch (error) {
                    logger.error('Error processing death log:', error);
                }
            }
        });
    }

    parseNewDeaths(content) {
        // Implement death log parsing based on PZ log format
        const deaths = [];
        // Parse logic here
        return deaths;
    }

    async announceDeaths(deaths, channelId, client) {
        const channel = await client.channels.fetch(channelId);
        if (!channel) return;

        for (const death of deaths) {
            const message = this.getRandomMessage(death.player, death.cause);
            await channel.send(message);
        }
    }
}

module.exports = new DeathMessageService();
