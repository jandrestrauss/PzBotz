const Command = require('../base/Command');
const rconService = require('../../services/rconService');

class ServerStatusCommand extends Command {
    constructor() {
        super('server_status', 'Gets the server status');
    }

    async execute(message) {
        try {
            const players = await rconService.execute('players');
            const uptime = await rconService.execute('uptime');
            return message.reply(`Server Status:
${players}
${uptime}`);
        } catch (error) {
            return message.reply('Server is currently offline.');
        }
    }
}

module.exports = new ServerStatusCommand();
