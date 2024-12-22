const { MessageEmbed } = require('discord.js');
const { hasAdminPermission } = require('../../utils/permissions');
const rcon = require('../../utils/rcon');
const logger = require('../../utils/logger');

module.exports = {
    name: 'players',
    description: 'Manage online players',
    async execute(message, args) {
        if (!hasAdminPermission(message.member)) {
            return message.reply('You do not have permission to use this command.');
        }

        const [action, playerId, ...reason] = args;
        try {
            switch(action) {
                case 'list':
                    const players = await rcon.sendCommand('players');
                    const embed = new MessageEmbed()
                        .setTitle('Online Players')
                        .setDescription(players || 'No players online')
                        .setTimestamp();
                    message.reply({ embeds: [embed] });
                    break;

                case 'kick':
                    if (!playerId) return message.reply('Please specify a player ID');
                    await rcon.sendCommand(`kickuser ${playerId} ${reason.join(' ')}`);
                    message.reply(`Player ${playerId} has been kicked.`);
                    break;

                case 'ban':
                    if (!playerId) return message.reply('Please specify a player ID');
                    await rcon.sendCommand(`banid ${playerId} ${reason.join(' ')}`);
                    message.reply(`Player ${playerId} has been banned.`);
                    break;

                default:
                    message.reply('Available actions: list, kick, ban');
            }
        } catch (error) {
            logger.error('Player management command error:', error);
            message.reply('Failed to execute command.');
        }
    }
};
