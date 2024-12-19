const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const config = require('../config/wheel.json');
const rcon = require('../utils/rcon');

class WheelManager {
    async createWheelUI(message, userPoints) {
        const embed = new MessageEmbed()
            .setTitle('🎡 Zombie Survival Wheel')
            .setDescription(`Spin cost: ${config.spinPrice} points\nYour points: ${userPoints}`)
            .setColor('#FF0000');

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('wheel_spin')
                    .setLabel('🎯 SPIN!')
                    .setStyle('DANGER')
                    .setDisabled(userPoints < config.spinPrice)
            );

        return { embeds: [embed], components: [row] };
    }

    async handleSpin(interaction, userPoints) {
        if (userPoints < config.spinPrice) return false;

        const prize = this.selectPrize();
        await rcon.sendCommand(`addpoints ${interaction.user.id} ${prize.points}`);
        await rcon.sendCommand(`additem ${interaction.user.id} ${prize.id} 1`);

        return prize;
    }

    selectPrize() {
        const totalWeight = config.prizes.reduce((sum, prize) => sum + prize.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const prize of config.prizes) {
            random -= prize.weight;
            if (random <= 0) return prize;
        }
        return config.prizes[0];
    }
}

module.exports = new WheelManager();