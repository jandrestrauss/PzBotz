const { MessageEmbed } = require('discord.js');
const { hasAdminPermission } = require('../../utils/permissions');
const logger = require('../../utils/logger');

module.exports = {
    name: 'whitelist',
    description: 'Manage server whitelist',
    async execute(message, args) {
        if (!hasAdminPermission(message.member)) {
            return message.reply('You do not have permission to manage the whitelist.');
        }

        const [action, steamId] = args;
        
        try {
            switch(action) {
                case 'add':
                    await global.serverManager.addToWhitelist(steamId);
                    message.reply(`Added ${steamId} to whitelist`);
                    break;
                case 'remove':
                    await global.serverManager.removeFromWhitelist(steamId);
                    message.reply(`Removed ${steamId} from whitelist`);
                    break;
                case 'list':
                    const whitelist = await global.serverManager.getWhitelist();
                    const embed = new MessageEmbed()
                        .setTitle('Server Whitelist')
                        .setDescription(whitelist.join('\n') || 'No entries')
                        .setTimestamp();
                    message.reply({ embeds: [embed] });
                    break;
                default:
                    message.reply('Usage: !whitelist <add|remove|list> [steamId]');
            }
        } catch (error) {
            logger.error('Whitelist command error:', error);
            message.reply('Failed to execute whitelist command.');
        }
    }
};
