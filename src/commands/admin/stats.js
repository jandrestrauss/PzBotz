const Command = require('../base/Command');
const statisticsService = require('../../services/statisticsService');
const { MessageEmbed } = require('discord.js');

class StatsCommand extends Command {
    constructor() {
        super('stats', 'View server statistics', { permissions: ['ADMINISTRATOR'] });
    }

    async execute(message, args) {
        const stats = statisticsService.getStats();
        const dailyStats = statisticsService.getDailyStats();

        const embed = new MessageEmbed()
            .setTitle('Server Statistics')
            .setColor('#0099ff')
            .addField('Overall Statistics', 
                `Total Players: ${stats.totalPlayers}\n` +
                `Peak Players: ${stats.peakPlayers}\n` +
                `Total Restarts: ${stats.restarts}\n` +
                `Total Crashes: ${stats.crashes}`
            );

        if (dailyStats) {
            embed.addField('Today\'s Statistics',
                `Players Today: ${dailyStats.players}\n` +
                `Peak Players Today: ${dailyStats.peakPlayers}\n` +
                `Restarts Today: ${dailyStats.restarts}\n` +
                `Crashes Today: ${dailyStats.crashes}`
            );
        }

        embed.setFooter({ text: `Last Updated: ${new Date(stats.lastUpdate).toLocaleString()}` });

        return message.reply({ embeds: [embed] });
    }
}

module.exports = new StatsCommand();
