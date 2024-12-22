const server = require('./server');
const discordBot = require('../discord/bot');
const logger = require('../utils/logger');

class ZomboidEventHandler {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        server.on('status', (status) => {
            discordBot.updateStatus(status);
            logger.logEvent(`Server status changed to: ${status}`);
        });

        server.on('playerJoin', (player) => {
            discordBot.notifyPlayerJoin(player);
            logger.logEvent(`Player joined: ${player.username}`);
        });

        server.on('playerLeave', (player) => {
            discordBot.notifyPlayerLeave(player);
            logger.logEvent(`Player left: ${player.username}`);
        });

        server.on('error', (error) => {
            discordBot.notifyAdmins(`Server error: ${error.message}`);
            logger.logEvent(`Server error: ${error.message}`);
        });
    }

    async handleCommand(command, user) {
        try {
            switch(command) {
                case 'restart':
                    await server.restart();
                    break;
                case 'status':
                    return {
                        status: server.status,
                        playerCount: server.getPlayerCount(),
                        uptime: server.getUptime()
                    };
                default:
                    throw new Error('Unknown command');
            }
        } catch (error) {
            logger.logEvent(`Command error: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new ZomboidEventHandler();
