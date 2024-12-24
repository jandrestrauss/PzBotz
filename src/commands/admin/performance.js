const Command = require('../base/Command');
const statisticsService = require('../../services/statisticsService');
const chartGenerator = require('../../utils/chartGenerator');
const { MessageAttachment, MessageEmbed } = require('discord.js');

class PerformanceCommand extends Command {
    constructor() {
        super('performance', 'View server performance charts', { permissions: ['ADMINISTRATOR'] });
    }

    async execute(message, args) {
        const timeframe = this.parseTimeframe(args[0]);
        try {
            const stats = await statisticsService.getStatistics(timeframe);
            const chartBuffer = await chartGenerator.generatePerformanceChart(stats, timeframe);
            
            const attachment = new MessageAttachment(chartBuffer, 'performance.png');
            const embed = new MessageEmbed()
                .setTitle('Server Performance')
                .setImage('attachment://performance.png')
                .setFooter({ text: `Last ${timeframe / (1000 * 60 * 60)} hours` });

            return message.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            return message.reply('Failed to generate performance chart');
        }
    }

    parseTimeframe(arg) {
        // Default to 24 hours
        if (!arg) return 24 * 60 * 60 * 1000;
        
        const hours = parseInt(arg);
        if (isNaN(hours) || hours < 1 || hours > 168) {
            return 24 * 60 * 60 * 1000;
        }
        return hours * 60 * 60 * 1000;
    }
}

module.exports = new PerformanceCommand();
