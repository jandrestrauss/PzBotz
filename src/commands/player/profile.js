const { MessageEmbed } = require('discord.js');
const gameEconomy = require('../../integration/gameEconomy');
const playerStats = require('../../models/PlayerStats');
const { getSteamId } = require('../../utils/playerUtils');

module.exports = {
    name: 'profile',
    description: 'View player profile',
    async execute(message, args) {
        try {
            const targetId = args[0] || message.author.id;
            const steamId = await getSteamId(targetId);
            
            if (!steamId) {
                return message.reply('Account not linked. Use !link <steam-id> to link your account.');
            }

            const [points, stats] = await Promise.all([
                gameEconomy.getPlayerPoints(steamId),
                playerStats.getPlayerStats(steamId)
            ]);

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Player Profile')
                .addField('Points', points.toString(), true)
                .addField('Playtime', `${stats.playtime || 0} hours`, true)
                .addField('Kills', stats.zombieKills?.toString() || '0', true)
                .addField('Deaths', stats.deaths?.toString() || '0', true)
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Profile command error:', error);
            message.reply('Failed to fetch profile data.');
        }
    }
};
