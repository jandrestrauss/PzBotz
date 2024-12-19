const fs = require('fs').promises;
const path = require('path');
const channelConfigPath = path.join(__dirname, '../../config/channelConfig.json');

module.exports = {
    name: 'togglePublicCommand',
    description: 'Toggle public command access for a channel',
    async execute(message, args, client) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        try {
            const channelConfig = JSON.parse(await fs.readFile(channelConfigPath, 'utf8'));
            const channelId = message.channel.id;

            if (channelConfig.publicChannels.includes(channelId)) {
                channelConfig.publicChannels = channelConfig.publicChannels.filter(id => id !== channelId);
                message.channel.send('Public commands disabled for this channel.');
            } else {
                channelConfig.publicChannels.push(channelId);
                message.channel.send('Public commands enabled for this channel.');
            }

            await fs.writeFile(channelConfigPath, JSON.stringify(channelConfig, null, 2));
        } catch (error) {
            console.error('Error toggling public command access:', error);
            message.channel.send('Failed to toggle public command access.');
        }
    }
};