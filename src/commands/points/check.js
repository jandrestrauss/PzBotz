const { MessageEmbed } = require('discord.js');
const gameEconomy = require('../../integration/gameEconomy');
const { getSteamId } = require('../../utils/playerUtils');

module.exports = {
    name: 'points',
    description: 'Check your in-game points',
    async execute(message, args) {
        const steamId = await getSteamId(message.author.id);
        if (!steamId) {
            return message.reply('Your Discord account is not linked to a Steam ID.');
        }

        const points = await gameEconomy.getPlayerPoints(steamId);
        
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('In-Game Points')
            .setDescription(`You have ${points} points`)
            .setFooter('Points can be earned through in-game activities')
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
