const { MessageEmbed } = require('discord.js');
const logger = require('../utils/logger');

class NotificationService {
    constructor(client) {
        this.client = client;
        this.channels = {
            status: process.env.STATUS_CHANNEL_ID,
            alerts: process.env.ALERT_CHANNEL_ID,
            logs: process.env.LOG_CHANNEL_ID
        };
    }

    async sendAlert(type, message, data = {}) {
        try {
            const channel = await this.client.channels.fetch(this.channels.alerts);
            const embed = new MessageEmbed()
                .setColor(this.getAlertColor(type))
                .setTitle(`${type} Alert`)
                .setDescription(message)
                .addFields(
                    Object.entries(data).map(([key, value]) => ({
                        name: key,
                        value: String(value),
                        inline: true
                    }))
                )
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            logger.error('Failed to send alert:', error);
        }
    }

    getAlertColor(type) {
        const colors = {
            ERROR: '#ff0000',
            WARNING: '#ffaa00',
            INFO: '#00ff00',
            SUCCESS: '#00ff00'
        };
        return colors[type] || '#ffffff';
    }
}

module.exports = NotificationService;
