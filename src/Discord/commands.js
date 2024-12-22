const ZomboidServer = require('../zomboid/server');
const logger = require('../utils/logger');

const commands = {
    restart: {
        description: 'Restart the server',
        execute: async (message) => {
            try {
                await ZomboidServer.restart();
                message.reply('Server is restarting...');
            } catch (error) {
                logger.error('Failed to restart server:', error);
                message.reply('Failed to restart server.');
            }
        }
    },
    status: {
        description: 'Get server status',
        execute: async (message) => {
            const status = ZomboidServer.status;
            message.reply(`Server status: ${status}`);
        }
    },
    players: {
        description: 'List online players',
        execute: async (message) => {
            const players = ZomboidServer.getOnlinePlayers();
            message.reply(`Online players: ${players.join(', ')}`);
        }
    }
};

const handleCommand = async (command, args, message) => {
    if (commands[command]) {
        await commands[command].execute(message, args);
    } else {
        message.reply('Unknown command.');
    }
};

module.exports = { handleCommand };
