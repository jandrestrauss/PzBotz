const Command = require('../base/Command');
const rconService = require('../../services/rconService');
const logger = require('../../utils/logger');
const { exec } = require('child_process');

class ServerCommand extends Command {
    constructor() {
        super('server', 'Server management commands', { permissions: ['ADMINISTRATOR'] });
        this.subcommands = new Map([
            ['start', this.startServer],
            ['stop', this.stopServer],
            ['save', this.saveServer],
            ['clean', this.cleanServer],
            ['reset', this.resetServer]
        ]);
    }

    async execute(message, args) {
        if (!args.length) {
            return message.reply('Available subcommands: start, stop, save, clean, reset');
        }

        const subcommand = this.subcommands.get(args[0].toLowerCase());
        if (!subcommand) {
            return message.reply('Invalid subcommand');
        }

        try {
            await subcommand.call(this, message);
        } catch (error) {
            logger.error(`Server command failed: ${args[0]}`, error);
            message.reply('Command failed. Check logs for details.');
        }
    }

    async startServer(message) {
        exec('server.bat', (error) => {
            if (error) {
                logger.error('Server start failed:', error);
                return message.reply('Failed to start server');
            }
            message.reply('Server is starting...');
        });
    }

    async stopServer(message) {
        await rconService.execute('quit');
        message.reply('Server is stopping...');
    }

    async saveServer(message) {
        await rconService.execute('save');
        message.reply('Server saved successfully');
    }

    async cleanServer(message) {
        // Implement server cleanup logic
        message.reply('Server cleanup initiated');
    }

    async resetServer(message) {
        await message.reply('WARNING: This will reset the server. Type "CONFIRM" within 30 seconds to proceed.');
        
        try {
            const confirmation = await message.channel.awaitMessages({
                filter: m => m.author.id === message.author.id && m.content === 'CONFIRM',
                max: 1,
                time: 30000,
                errors: ['time']
            });

            if (confirmation.first()) {
                // Implement server reset logic
                message.reply('Server reset initiated');
            }
        } catch (error) {
            message.reply('Reset cancelled');
        }
    }
}

module.exports = new ServerCommand();
