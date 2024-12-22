const maintenanceSystem = require('../../server/maintenance');
const { hasAdminPermission } = require('../../utils/permissions');

module.exports = {
    name: 'server',
    description: 'Server management commands',
    async execute(message, args) {
        if (!hasAdminPermission(message.member)) {
            return message.reply('You do not have permission to use this command.');
        }

        const [subcommand] = args;
        switch (subcommand) {
            case 'restart':
                await maintenanceSystem.scheduleRestart(5 * 60 * 1000); // 5 minutes
                message.reply('Server restart scheduled in 5 minutes.');
                break;
            case 'status':
                const stats = await global.serverStats.getCurrentStats();
                message.reply(`Server Status:\nPlayers: ${stats.playerCount}\nCPU: ${stats.cpu}%\nMemory: ${stats.memory}%`);
                break;
            default:
                message.reply('Available commands: restart, status');
        }
    }
};
