const Command = require('../base/Command');
const shopService = require('../../services/shopService');
const logger = require('../../utils/logger');

class BuyCommand extends Command {
    constructor() {
        super('buy', 'Buy an item from the shop', { cooldown: 10 });
    }

    async execute(message, args) {
        if (!args.length) {
            return message.reply('Please specify an item to buy. Use !shop to see available items.');
        }

        const itemName = args.join(' ');
        try {
            await shopService.buyItem(message.author.username, itemName);
            return message.reply(`Successfully purchased ${itemName}!`);
        } catch (error) {
            logger.error(`Buy command failed for ${message.author.username}:`, error);
            return message.reply('Failed to purchase item. Make sure the item name is correct.');
        }
    }
}

module.exports = new BuyCommand();
