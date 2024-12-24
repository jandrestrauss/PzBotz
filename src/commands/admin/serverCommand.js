const Command = require('../base/Command');
const rconService = require('../../services/rconService');
const logger = require('../../utils/logger');

class ServerCommandCommand extends Command {
    constructor() {
        super('server_cmd', 'Executes a server command');
    }

    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You need administrator permissions to use this command.');
        }

        if (!args.length) {
            return message.reply('Please provide a command to execute.');
        }

        const command = args.join(' ');
        try {
            const response = await rconService.execute(command);
            message.reply(`Command executed. Response: ${response || 'No response'}`);
        } catch (error) {
            logger.error(`Server command failed: ${command}`, error);
            message.reply('Failed to execute server command.');
        }
    }
}

module.exports = new ServerCommandCommand();
