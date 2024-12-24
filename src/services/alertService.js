const EventEmitter = require('events');
const logger = require('../utils/logger');
const channelManager = require('./channelManager');

class AlertService extends EventEmitter {
    constructor() {
        super();
        this.thresholds = {
            cpu: 80,
            memory: 90,
            players: 50,
            diskSpace: 90
        };
        this.alertHistory = [];
    }

    async sendAlert(type, value, message) {
        const logChannelId = channelManager.getChannel('log');
        if (!logChannelId) return;

        const alert = {
            type,
            value,
            message,
            timestamp: new Date()
        };

        this.alertHistory.push(alert);
        if (this.alertHistory.length > 100) {
            this.alertHistory.shift();
        }

        try {
            const formattedMessage = this.formatAlertMessage(alert);
            this.emit('alert', formattedMessage, logChannelId);
            logger.logEvent(`Alert: ${type} - ${message}`);
        } catch (error) {
            logger.error('Failed to send alert:', error);
        }
    }

    formatAlertMessage(alert) {
        return `🚨 **Alert: ${alert.type}**\n` +
               `Value: ${alert.value}\n` +
               `Message: ${alert.message}\n` +
               `Time: ${alert.timestamp.toLocaleString()}`;
    }

    getRecentAlerts() {
        return this.alertHistory.slice(-10);
    }
}

module.exports = new AlertService();
