const { MessageEmbed } = require('discord.js');
const monitoring = require('../../monitoring');
const logger = require('../../utils/logger');

module.exports = {
    name: 'status',
    description: 'Show server status',
    async execute(message) {
        try {
            const metrics = await monitoring.collectMetrics();
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Server Status')
                .addField('Players Online', metrics.playerCount.toString(), true)
                .addField('CPU Usage', `${metrics.cpu}%`, true)
                .addField('Memory Usage', `${metrics.memory}%`, true)
                .addField('Uptime', `${Math.floor(metrics.uptime / 3600)} hours`, true)
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Status command error:', error);
            message.reply('Failed to fetch server status.');
        }
    }
};
