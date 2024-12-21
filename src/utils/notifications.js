const Discord = require('discord.js');

class NotificationHandler {
    constructor(client) {
        this.client = client;
        this.notifications = new Map();
    }

    async send(channelId, message, type = 'info') {
        const channel = this.client.channels.cache.get(channelId);
        if (!channel) return;

        const colors = {
            info: '#7289DA',
            success: '#43B581',
            warning: '#FAA61A',
            error: '#F04747'
        };

        const embed = new Discord.MessageEmbed()
            .setColor(colors[type])
            .setDescription(message)
            .setTimestamp();

        return channel.send(embed);
    }

    async sendAdminAlert(message, type = 'warning') {
        const adminChannels = this.client.config.adminChannels || [];
        for (const channelId of adminChannels) {
            await this.send(channelId, `🚨 **Admin Alert**: ${message}`, type);
        }
    }

    async sendServerStatus(status) {
        const statusChannels = this.client.config.statusChannels || [];
        const embed = new Discord.MessageEmbed()
            .setTitle('Server Status Update')
            .setColor(status.online ? '#43B581' : '#F04747')
            .addField('Status', status.online ? 'Online' : 'Offline')
            .addField('Players', `${status.players}/${status.maxPlayers}`)
            .addField('CPU Usage', `${status.cpu}%`)
            .addField('Memory Usage', `${status.memory}%`)
            .setTimestamp();

        for (const channelId of statusChannels) {
            const channel = this.client.channels.cache.get(channelId);
            if (channel) {
                channel.send(embed).catch(console.error);
            }
        }
    }
}

module.exports = NotificationHandler;
