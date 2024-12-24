const Command = require('../base/Command');
const performanceReport = require('../../services/performanceReport');
const { MessageEmbed } = require('discord.js');

class PerformanceCommand extends Command {
    constructor() {
        super('performance', 'View server performance stats and reports', { 
            permissions: ['ADMINISTRATOR'] 
        });
    }

    async execute(message, args) {
        try {
            if (args[0] === 'report') {
                const report = performanceReport.generateReport();
                const embed = this.createReportEmbed(report);
                return message.reply({ embeds: [embed] });
            }

            const summary = performanceReport.generateSummary();
            const embed = this.createStatsEmbed(summary);
            return message.reply({ embeds: [embed] });
        } catch (error) {
            return message.reply('Failed to generate performance information');
        }
    }

    createReportEmbed(report) {
        return new MessageEmbed()
            .setTitle('Server Performance Report')
            .setColor('#00ff00')
            .addField('CPU Usage', `Average: ${report.summary.averageCpu.toFixed(2)}%\nPeak: ${report.summary.peakCpu.toFixed(2)}%`)
            .addField('Memory Usage', `Average: ${report.summary.averageMemory.toFixed(2)}%\nPeak: ${report.summary.peakMemory.toFixed(2)}%`)
            .addField('Players', `Average: ${report.summary.averagePlayers.toFixed(1)}`)
            .addField('Recommendations', report.recommendations.join('\n') || 'No recommendations')
            .setFooter({ text: `Generated at ${new Date().toLocaleString()}` });
    }

    createStatsEmbed(summary) {
        return new MessageEmbed()
            .setTitle('Current Performance Statistics')
            .setColor('#0099ff')
            .addField('CPU Usage', `${summary.averageCpu.toFixed(2)}%`)
            .addField('Memory Usage', `${summary.averageMemory.toFixed(2)}%`)
            .addField('Players', `${summary.averagePlayers.toFixed(1)}`)
            .setFooter({ text: `Last hour average` });
    }
}

module.exports = new PerformanceCommand();
