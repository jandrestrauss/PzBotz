const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

class Wheelspin {
    constructor() {
        this.prizes = [
            { name: 'Military Backpack', id: 'Base.ALICEpack', rarity: 'rare', emoji: '🎒' },
            { name: 'Katana', id: 'Base.Katana', rarity: 'epic', emoji: '⚔️' },
            { name: 'First Aid Kit', id: 'Base.FirstAidKit', rarity: 'common', emoji: '🏥' },
            // Add more prizes here
        ];
    }

    async spin(message, playerData) {
        const spinEmbed = new MessageEmbed()
            .setTitle('🎡 Zombie Survival Wheel 🎡')
            .setDescription('Spinning the wheel of fortune...')
            .setColor('#FF0000')
            .setImage('https://i.imgur.com/wheel_spinning.gif');

        const spinButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('spin_wheel')
                    .setLabel('🎯 SPIN!')
                    .setStyle('SUCCESS')
                    .setDisabled(true)
            );

        const msg = await message.channel.send({
            embeds: [spinEmbed],
            components: [spinButton]
        });

        // Simulate wheel spinning
        setTimeout(async () => {
            const prize = this.prizes[Math.floor(Math.random() * this.prizes.length)];
            const resultEmbed = new MessageEmbed()
                .setTitle('🎉 Prize Won! 🎉')
                .setDescription(`${message.author} won a ${prize.emoji} ${prize.name}!`)
                .setColor('#00FF00')
                .addField('Rarity', prize.rarity.toUpperCase(), true)
                .setImage('https://i.imgur.com/prize_won.gif');

            await msg.edit({
                embeds: [resultEmbed],
                components: []
            });

            // Execute server command to give item
            return { command: `additem ${playerData.steamId} ${prize.id} 1` };
        }, 3000);
    }
}

module.exports = new Wheelspin();