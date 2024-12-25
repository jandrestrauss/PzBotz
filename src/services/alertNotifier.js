const EventEmitter = require('events');
const logger = require('../utils/logger');
const { MessageEmbed } = require('discord.js');

class AlertNotifier extends EventEmitter {
    constructor() {
        super();
        this.channels = new Map();
        this.severityColors = {
            info: '#0099ff',
            warning: '#ffcc00',
            critical: '#ff0000'
        };
    }

    setChannel(type, channel) {
        this.channels.set(type, channel);
    }

    async notify(alert) {
        try {
            await this.sendDiscordAlert(alert);
            await this.logAlert(alert);
            
            if (alert.severity === 'critical') {
                await this.sendEmergencyNotification(alert);
            }
        } catch (error) {
            logger.error('Failed to send alert:', error);
        }
    }

    async sendDiscordAlert(alert) {
        const channel = this.channels.get('discord');
        if (!channel) return;

        const embed = new MessageEmbed()
            .setColor(this.severityColors[alert.severity])
            .setTitle(`${alert.severity.toUpperCase()}: ${alert.metric}`)
            .setDescription(alert.message)
            .addField('Value', alert.value.toString())
            .addField('Threshold', alert.threshold.toString())
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }

    async sendEmergencyNotification(alert) {
        // Implementation for emergency notifications
        // (Email, SMS, etc.)
    }

    logAlert(alert) {
        const logMessage = `[${alert.severity}] ${alert.metric}: ${alert.message} (${alert.value})`;
        logger.warn(logMessage);
    }
}

module.exports = new AlertNotifier();
