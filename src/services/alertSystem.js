const EventEmitter = require('events');
const logger = require('../utils/logger');
const channelManager = require('./channelManager');
const { MessageEmbed } = require('discord.js');

class AlertSystem extends EventEmitter {
    constructor() {
        super();
        this.alerts = [];
        this.levels = {
            INFO: { color: '#0099ff', icon: 'ℹ️' },
            WARNING: { color: '#ffcc00', icon: '⚠️' },
            CRITICAL: { color: '#ff0000', icon: '🚨' }
        };
    }

    async sendAlert(level, title, message, data = {}) {
        const alert = {
            id: Date.now(),
            level,
            title,
            message,
            data,
            timestamp: new Date()
        };

        this.alerts.push(alert);
        if (this.alerts.length > 100) this.alerts.shift();

        try {
            await this.notifyDiscord(alert);
            this.emit('alertSent', alert);
        } catch (error) {
            logger.error('Failed to send alert:', error);
        }
    }

    async notifyDiscord(alert) {
        const channelId = channelManager.getChannel('log');
        if (!channelId) return;

        const embed = new MessageEmbed()
            .setColor(this.levels[alert.level].color)
            .setTitle(`${this.levels[alert.level].icon} ${alert.title}`)
            .setDescription(alert.message)
            .addFields(
                Object.entries(alert.data).map(([key, value]) => ({
                    name: key,
                    value: String(value),
                    inline: true
                }))
            )
            .setTimestamp(alert.timestamp);

        try {
            const channel = await global.bot.channels.fetch(channelId);
            await channel.send({ embeds: [embed] });
        } catch (error) {
            logger.error('Failed to send Discord alert:', error);
        }
    }

    getRecentAlerts(limit = 10) {
        return this.alerts.slice(-limit);
    }

    clearAlerts() {
        this.alerts = [];
    }
}

module.exports = new AlertSystem();
