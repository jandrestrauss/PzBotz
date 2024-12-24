const Command = require('../base/Command');
const wheelSpinService = require('../../services/wheelSpinService');
const { MessageEmbed } = require('discord.js');

class WheelSpinCommand extends Command {
    constructor() {
        super('wheelspin', 'Spin the wheel for a random reward', { cooldown: 300 });
    }

    async execute(message) {
        try {
            const reward = await wheelSpinService.spin(message.author.username);
            const embed = new MessageEmbed()
                .setTitle('🎡 Wheel Spin Result!')
                .setDescription(`You won: ${reward.name} (x${reward.quantity})`)
                .setColor('#00ff00');

            return message.reply({ embeds: [embed] });
        } catch (error) {
            return message.reply('Failed to process wheel spin. Please try again later.');
        }
    }
}

module.exports = new WheelSpinCommand();
