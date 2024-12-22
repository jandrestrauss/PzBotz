const { MessageEmbed } = require('discord.js');
const gameEconomy = require('../../integration/gameEconomy');
const playerUtils = require('../../utils/playerUtils');
const logger = require('../../utils/logger');

module.exports = {
    name: 'leaderboard',
    description: 'Show points leaderboard',
    async execute(message) {
        try {
            const data = await gameEconomy.fetchGameEconomyData();
            const leaderboard = Object.entries(data.playerPoints)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);

            const embed = new MessageEmbed()
                .setColor('#ffd700')
                .setTitle('Points Leaderboard')
                .setDescription(
                    await Promise.all(leaderboard.map(async ([steamId, points], index) => {
                        const username = await playerUtils.getPlayerName(steamId);
                        return `${index + 1}. ${username}: ${points} points`;
                    }))
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Leaderboard command error:', error);
            message.reply('Failed to fetch leaderboard.');
        }
    }
};
