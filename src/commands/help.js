const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all commands',
    async execute(message, args, client) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setDescription('List of available commands:')
            .setColor('#7289DA');

        client.commands.forEach(command => {
            embed.addField(`!${command.name}`, command.description, false);
        });

        message.channel.send(embed).catch(console.error);
    }
};