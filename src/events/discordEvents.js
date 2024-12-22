const { Client } = require('discord.js');
const logger = require('../utils/logger');
const config = require('../config');

class DiscordEventHandler {
    constructor(client) {
        this.client = client;
        this.setupEvents();
    }

    setupEvents() {
        this.client.on('ready', () => {
            logger.info(`Bot logged in as ${this.client.user.tag}`);
            this.updatePresence();
        });

        this.client.on('guildCreate', guild => {
            logger.info(`Joined new guild: ${guild.name}`);
            this.sendWelcomeMessage(guild);
        });

        this.client.on('error', error => {
            logger.error('Discord client error:', error);
            this.handleDiscordError(error);
        });
    }

    async updatePresence() {
        try {
            const stats = await global.serverStats.getCurrentStats();
            this.client.user.setActivity(`${stats.playerCount} players online`, { type: 'WATCHING' });
        } catch (error) {
            logger.error('Failed to update presence:', error);
        }
    }

    async sendWelcomeMessage(guild) {
        const channel = guild.systemChannel;
        if (channel && channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
            await channel.send({
                embeds: [{
                    title: 'Project Zomboid Server Bot',
                    description: 'Thanks for adding me! Use !help to see available commands.',
                    color: 0x00ff00
                }]
            });
        }
    }
}

module.exports = DiscordEventHandler;
