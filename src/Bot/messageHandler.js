const channelManager = require('../services/channelManager');
const commandHandler = require('../commands/base/CommandHandler');
const logger = require('../utils/logger');

class MessageHandler {
    constructor() {
        this.prefix = '!';
    }

    async handle(message) {
        if (message.author.bot || !message.content.startsWith(this.prefix)) {
            return;
        }

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check channel permissions
        const channelType = this.getChannelType(message.channel.id);
        if (!channelType) {
            return;
        }

        try {
            await commandHandler.handle(message, [commandName, ...args]);
        } catch (error) {
            logger.error(`Error handling command ${commandName}:`, error);
            message.reply('An error occurred while processing your command.');
        }
    }

    getChannelType(channelId) {
        if (channelId === channelManager.getChannel('command')) return 'command';
        if (channelId === channelManager.getChannel('public')) return 'public';
        if (channelId === channelManager.getChannel('log')) return 'log';
        return null;
    }
}

module.exports = new MessageHandler();
