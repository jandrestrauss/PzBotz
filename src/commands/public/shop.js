const Command = require('../base/Command');
const shopService = require('../../services/shopService');
const { MessageEmbed } = require('discord.js');

class ShopCommand extends Command {
    constructor() {
        super('shop', 'Displays the list of items available for purchase');
    }

    async execute(message) {
        const items = shopService.getItems();
        const embed = new MessageEmbed()
            .setTitle('Server Shop')
            .setDescription('Use `!buy <item name>` to purchase an item')
            .setColor('#0099ff');

        items.forEach(item => {
            embed.addField(
                item.name,
                `Cost: ${item.cost} points\nQuantity: ${item.quantity}`
            );
        });

        return message.reply({ embeds: [embed] });
    }
}

module.exports = new ShopCommand();
