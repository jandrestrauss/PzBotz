const { MessageEmbed } = require('discord.js');
const { hasAdminPermission } = require('../utils/permissions');

module.exports = {
    name: 'help',
    description: 'Show available commands',
    async execute(message, args) {
        const isAdmin = hasAdminPermission(message.member);
        const commands = new Map();

        // Basic commands
        commands.set('General', [
            '`!status` - Show server status',
            '`!points` - Check your points',
            '`!gift @user amount` - Gift points to another player',
            '`!leaderboard` - Show points leaderboard'
        ]);

        // Admin commands
        if (isAdmin) {
            commands.set('Admin', [
                '`!whitelist <add|remove|list> [steamId]` - Manage whitelist',
                '`!restart` - Schedule server restart',
                '`!backup` - Create manual backup',
                '`!logs [count]` - View recent logs'
            ]);
        }

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setTimestamp();

        for (const [category, cmdList] of commands) {
            embed.addField(category, cmdList.join('\n'));
        }

        message.reply({ embeds: [embed] });
    }
};