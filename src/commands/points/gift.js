const { MessageEmbed } = require('discord.js');
const gameEconomy = require('../../integration/gameEconomy');
const { getSteamId } = require('../../utils/playerUtils');
const logger = require('../../utils/logger');

module.exports = {
    name: 'gift',
    description: 'Gift points to another player',
    cooldown: 60, // 1 minute cooldown
    async execute(message, args) {
        if (args.length !== 2) {
            return message.reply('Usage: !gift <@user> <amount>');
        }

        const targetUser = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!targetUser || isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid user and amount.');
        }

        try {
            const [senderSteamId, targetSteamId] = await Promise.all([
                getSteamId(message.author.id),
                getSteamId(targetUser.id)
            ]);

            if (!senderSteamId || !targetSteamId) {
                return message.reply('Both users must have linked Steam accounts.');
            }

            const success = await gameEconomy.transferPoints(senderSteamId, targetSteamId, amount);
            
            if (success) {
                const embed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle('Points Gifted')
                    .setDescription(`Successfully gifted ${amount} points to ${targetUser.tag}`)
                    .setTimestamp();
                message.reply({ embeds: [embed] });
            } else {
                message.reply('Insufficient points or transfer failed.');
            }
        } catch (error) {
            logger.error('Gift command error:', error);
            message.reply('Failed to process gift.');
        }
    }
};
