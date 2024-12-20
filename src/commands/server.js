const { MessageEmbed } = require('discord.js');
const serverManager = require('../modules/serverManager');
const permissions = require('../config/permissions');

module.exports = {
    name: 'server',
    description: 'Server management commands',
    usage: '<restart|schedule|kick|ban|whitelist|status|backup|console>',
    permission: 'ADMINISTRATOR',
    
    async execute(message, args) {
        if (!message.member.roles.cache.some(role => 
            permissions.roles.admin.includes(role.name))) {
            return message.reply('Insufficient permissions');
        }

        const [subCommand, ...params] = args;

        try {
            switch (subCommand?.toLowerCase()) {
                case 'restart':
                    await serverManager.restartServer();
                    return message.reply('🔄 Server restart initiated');

                case 'schedule':
                    if (!params[0]) return message.reply('Usage: !server schedule HH:MM [HH:MM...]');
                    await serverManager.setRestartSchedule(params);
                    return message.reply(`📅 Restart times set: ${params.join(', ')}`);

                case 'kick':
                    if (!params[0]) return message.reply('Usage: !server kick <username>');
                    await serverManager.kickPlayer(params[0]);
                    return message.reply(`👢 Kicked player: ${params[0]}`);

                case 'ban':
                    if (!params[1]) return message.reply('Usage: !server ban <username> <reason>');
                    const [username, ...reason] = params;
                    await serverManager.banPlayer(username, reason.join(' '));
                    return message.reply(`🚫 Banned player: ${username}`);

                case 'whitelist':
                    if (!params[1]) return message.reply('Usage: !server whitelist <add|remove> <username>');
                    const [action, player] = params;
                    if (action === 'add') {
                        await serverManager.whitelistAdd(player);
                        return message.reply(`✅ Added ${player} to whitelist`);
                    } else if (action === 'remove') {
                        await serverManager.whitelistRemove(player);
                        return message.reply(`❌ Removed ${player} from whitelist`);
                    }
                    break;

                case 'status':
                    const status = await serverManager.getServerStatus();
                    const statusEmbed = new MessageEmbed()
                        .setTitle('🖥️ Server Status')
                        .setColor('#00ff00')
                        .addField('Players', status.players.toString(), true)
                        .addField('Memory', status.memory, true)
                        .addField('Uptime', status.uptime, true)
                        .setTimestamp();
                    return message.channel.send({ embeds: [statusEmbed] });

                case 'backup':
                    const backupPath = await serverManager.createBackup();
                    return message.reply(`💾 Backup created: ${backupPath}`);

                case 'console':
                    if (!params[0]) return message.reply('Usage: !server console <command>');
                    const result = await serverManager.executeConsoleCommand(params.join(' '));
                    return message.reply(`Console output:\n\`\`\`\n${result}\n\`\`\``);

                default:
                    return message.reply('Available commands: restart, schedule, kick, ban, whitelist, status, backup, console');
            }
        } catch (error) {
            console.error('Server command error:', error);
            return message.reply(`❌ Error: ${error.message}`);
        }
    }
};