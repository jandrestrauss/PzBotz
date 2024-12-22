const { MessageEmbed } = require('discord.js');
const economySystem = require('../../economy/economySystem');

module.exports = {
    name: 'balance',
    description: 'Check your balance',
    async execute(message, args) {
        const balance = await economySystem.getBalance(message.author.id);
        
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Balance')
            .setDescription(`Your current balance: ${balance} coins`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
