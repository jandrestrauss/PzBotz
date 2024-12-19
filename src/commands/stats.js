const Discord = require('discord.js');
const getPlayerStatistics = require('../utils/getPlayerStatistics');

module.exports = {
    name: 'stats',
    description: 'Get player statistics',
    async execute(message, args, client) {
        try {
            const stats = await getPlayerStatistics();
            const embed = new Discord.MessageEmbed()
                .setTitle('Player Statistics')
                .setDescription('Current player statistics:')
                .setColor('#7289DA')
                .addField('Total Playtime', `${stats.totalPlaytime} hours`, true)
                .addField('Total Kills', `${stats.totalKills}`, true);

            stats.players.forEach(player => {
                embed.addField(player.name, `Playtime: ${(player.playtime / 3600).toFixed(2)} hours, Kills: ${player.kills}`, false);
            });

            message.channel.send(embed).catch(console.error);
        } catch (error) {
            message.channel.send('Failed to get player statistics.');
        }
    }
};