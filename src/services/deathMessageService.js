const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { MessageEmbed } = require('discord.js');

class DeathMessageService {
    constructor() {
        this.configPath = path.join(process.cwd(), 'config', 'death_messages.json');
        this.messages = [];
        this.loadMessages();
        this.logFile = path.join(process.cwd(), 'Zomboid', 'Logs', 'deaths.txt');
        this.lastRead = 0;
    }

    loadMessages() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.messages = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            }
        } catch (error) {
            logger.error('Failed to load death messages:', error);
        }
    }

    startWatching(discordClient, channelId) {
        if (!fs.existsSync(this.logFile)) {
            logger.error('Death log file not found:', this.logFile);
            return;
        }

        fs.watchFile(this.logFile, () => {
            this.checkNewDeaths(discordClient, channelId);
        });

        logger.logEvent('Death message service started');
    }

    async checkNewDeaths(discordClient, channelId) {
        try {
            const stats = fs.statSync(this.logFile);
            if (stats.size <= this.lastRead) return;

            const content = fs.readFileSync(this.logFile, 'utf8');
            const newContent = content.slice(this.lastRead);
            this.lastRead = stats.size;

            const deaths = this.parseDeaths(newContent);
            await this.announceDeaths(deaths, discordClient, channelId);
        } catch (error) {
            logger.error('Error checking deaths:', error);
        }
    }

    parseDeaths(content) {
        const deaths = [];
        const deathRegex = /(\w+) (died|was killed) by (.+)/g;
        let match;

        while ((match = deathRegex.exec(content)) !== null) {
            deaths.push({
                player: match[1],
                cause: match[3]
            });
        }

        return deaths;
    }

    async announceDeaths(deaths, discordClient, channelId) {
        const channel = await discordClient.channels.fetch(channelId);
        if (!channel) return;

        for (const death of deaths) {
            const message = this.getRandomMessage(death);
            const embed = new MessageEmbed()
                .setTitle('💀 Death Report')
                .setDescription(message)
                .setColor('#ff0000')
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        }
    }

    getRandomMessage({ player, cause }) {
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        return message.replace('{player}', player).replace('{cause}', cause);
    }
}

module.exports = new DeathMessageService();
