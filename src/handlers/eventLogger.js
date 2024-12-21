const logger = require('../utils/logger');
const ServerStats = require('../database/models/ServerStats');
const { MessageEmbed } = require('discord.js');

class EventLogger {
    constructor(bot) {
        this.bot = bot;
        this.logChannelId = bot.config.logChannelId;
    }

    async logEvent(type, description, data = {}) {
        try {
            // Save to database
            await ServerStats.findOneAndUpdate(
                { timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }},
                { 
                    $push: { 
                        events: {
                            type,
                            description,
                            timestamp: new Date(),
                            ...data
                        }
                    }
                },
                { upsert: true }
            );

            // Send to Discord
            await this.sendToDiscord(type, description, data);

            // Log to file
            logger.info(`${type}: ${description}`, data);

        } catch (error) {
            logger.error('Error logging event:', error);
        }
    }

    async sendToDiscord(type, description, data) {
        const channel = this.bot.client.channels.cache.get(this.logChannelId);
        if (!channel) return;

        const embed = new MessageEmbed()
            .setTitle(`Server Event: ${type}`)
            .setDescription(description)
            .setColor(this.getEventColor(type))
            .setTimestamp();

        // Add additional fields based on event type
        if (data.player) {
            embed.addField('Player', data.player, true);
        }
        if (data.location) {
            embed.addField('Location', data.location, true);
        }
        if (data.details) {
            embed.addField('Details', data.details);
        }

        await channel.send({ embeds: [embed] });
    }

    getEventColor(type) {
        const colors = {
            ERROR: '#ff0000',
            WARNING: '#ffaa00',
            INFO: '#00aaff',
            SUCCESS: '#00ff00',
            PLAYER: '#aa00ff',
            SYSTEM: '#ffffff'
        };
        return colors[type.toUpperCase()] || colors.INFO;
    }

    // Convenience methods for common events
    async logPlayerJoin(player) {
        await this.logEvent('PLAYER', `${player.name} joined the server`, { player: player.name });
    }

    async logPlayerLeave(player) {
        await this.logEvent('PLAYER', `${player.name} left the server`, { player: player.name });
    }

    async logServerStart() {
        await this.logEvent('SYSTEM', 'Server started');
    }

    async logServerStop() {
        await this.logEvent('SYSTEM', 'Server stopped');
    }

    async logError(error) {
        await this.logEvent('ERROR', error.message, { details: error.stack });
    }
}

module.exports = EventLogger;
