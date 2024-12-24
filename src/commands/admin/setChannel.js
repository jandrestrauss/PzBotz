const Command = require('../base/Command');
const fs = require('fs');
const path = require('path');

class SetChannelCommand {
    constructor(type) {
        this.type = type;
        this.configPath = path.join(__dirname, '../../../config/channels.json');
    }

    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You need administrator permissions to use this command.');
        }

        const channelMention = args[0];
        if (!channelMention) {
            return message.reply('Please mention a channel.');
        }

        const channelId = channelMention.replace(/[<#>]/g, '');
        const channel = message.guild.channels.cache.get(channelId);

        if (!channel) {
            return message.reply('Invalid channel.');
        }

        let config = {};
        if (fs.existsSync(this.configPath)) {
            config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        }

        config[this.type] = channelId;
        fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));

        return message.reply(`${this.type} channel set to ${channel.name}`);
    }
}

module.exports = {
    SetCommandChannel: new SetChannelCommand('command'),
    SetLogChannel: new SetChannelCommand('log'),
    SetPublicChannel: new SetChannelCommand('public')
};
