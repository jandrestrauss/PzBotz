const { MessageEmbed } = require('discord.js');
const gameEconomy = require('../../integration/gameEconomy');

module.exports = {
    name: 'player',
    description: 'Get player information',
    async execute(message, args) {
        const [steamId] = args;
        if (!steamId) {
            return message.reply('Please provide a Steam ID');
        }

        try {
            const points = await gameEconomy.getPlayerPoints(steamId);
            const stats = await global.playerStats.getPlayerStats(steamId);
            
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Player Information')
                .addField('Points', points.points.toString())
                .addField('Playtime', `${stats.playtime} hours`)
                .addField('Last Seen', stats.lastSeen)
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            message.reply('Failed to get player information');
            logger.error('Player info command error:', error);
        }
    }
};
