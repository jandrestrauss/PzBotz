const fs = require('fs').promises;
const path = require('path');
const channelConfigPath = path.join(__dirname, '../../config/channelConfig.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            const channelConfig = JSON.parse(await fs.readFile(channelConfigPath, 'utf8'));
            const isAdmin = message.member.hasPermission('ADMINISTRATOR');
            const isPublicChannel = channelConfig.publicChannels.includes(message.channel.id);
            const isAdminChannel = channelConfig.adminChannels.includes(message.channel.id);

            if (!isAdmin && !isPublicChannel) {
                return message.reply('Public commands are not enabled for this channel.');
            }

            // Verify account linking for protected commands
            if (protectedCommands.includes(command) && 
                !await Validator.validateLinkedAccount(message.author.id)) {
                return message.reply('You must link your Steam account first');
            }

            if (isAdmin || isAdminChannel || isPublicChannel) {
                await command.execute(message, args, client);
            } else {
                message.reply('You do not have permission to use this command in this channel.');
            }
        } catch (error) {
            console.error(error);
            message.reply(`Error: ${error.message}`);
        }
    }
};