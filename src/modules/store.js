const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

class Store {
    constructor() {
        this.items = {
            'wheelspin_ticket': { name: 'Wheel Spin Ticket', price: 500, emoji: '🎟️' },
            'medkit': { name: 'Medical Kit', price: 1000, emoji: '🏥', command: 'additem %player% Base.FirstAidKit 1' },
            'ammo': { name: 'Box of Ammo', price: 750, emoji: '🎯', command: 'additem %player% Base.Bullets45Box 1' }
        };
    }

    async displayStore(message, userPoints) {
        const embed = new MessageEmbed()
            .setTitle('🧟 Zomboid Survival Store 🧟')
            .setDescription('Buy items with your survival points!')
            .setColor('#880808')
            .setThumbnail('https://i.imgur.com/zombie_store.png')
            .setFooter({ text: `Your Points: ${userPoints}` });

        const rows = [];
        let currentRow = new MessageActionRow();
        let buttonCount = 0;

        for (const [id, item] of Object.entries(this.items)) {
            if (buttonCount && buttonCount % 3 === 0) {
                rows.push(currentRow);
                currentRow = new MessageActionRow();
            }

            currentRow.addComponents(
                new MessageButton()
                    .setCustomId(`buy_${id}`)
                    .setLabel(`${item.emoji} ${item.name} (${item.price}pts)`)
                    .setStyle('DANGER')
                    .setDisabled(userPoints < item.price)
            );

            buttonCount++;
        }

        if (currentRow.components.length > 0) {
            rows.push(currentRow);
        }

        return { embeds: [embed], components: rows };
    }
}

module.exports = new Store();