const Command = require('../base/Command');
const path = require('path');
const { exec } = require('child_process');
const logger = require('../../utils/logger');
const rconService = require('../../services/rconService');

class RestartServerCommand extends Command {
    constructor() {
        super('restart_server', 'Restarts the server');
    }

    async execute(message) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You need administrator permissions for this command.');
        }

        try {
            await rconService.execute('quit');
            message.reply('Server is shutting down...');

            setTimeout(() => {
                exec('server.bat', { cwd: process.cwd() }, (error) => {
                    if (error) {
                        logger.error('Server restart failed:', error);
                        return message.reply('Failed to restart server.');
                    }
                    message.reply('Server has been restarted successfully.');
                });
            }, 5000);
        } catch (error) {
            logger.error('Restart command failed:', error);
            return message.reply('Failed to execute restart command.');
        }
    }
}

module.exports = new RestartServerCommand();
