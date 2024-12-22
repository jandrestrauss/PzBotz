const { permissionMiddleware } = require('../security/permissions');
const gameServer = require('../server/gameServer');
const { Collection } = require('discord.js');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');
const userService = require('../services/userService');

class CommandHandler {
    constructor() {
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.loadCommands();
    }

    registerCommands() {
        this.addCommand('restart', {
            permission: 'SERVER_CONTROL',
            handler: async () => {
                await gameServer.restart();
                return 'Server restarting...';
            }
        });

        this.addCommand('players', {
            permission: 'VIEW_STATS',
            handler: async () => {
                const players = await gameServer.getPlayers();
                return `Online players: ${players.length}`;
            }
        });
    }

    addCommand(name, { permission, handler }) {
        this.commands.set(name, { permission, handler });
    }

    async executeCommand(name, user, ...args) {
        const command = this.commands.get(name);
        if (!command) throw new Error('Command not found');
        
        if (!permissionMiddleware(command.permission)(user)) {
            throw new Error('Permission denied');
        }

        return await command.handler(...args);
    }

    async handleCommand(message, prefix) {
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = this.commands.get(commandName);

        if (!command) return;

        try {
            await this.validateCommand(message, command);
            await command.execute(message, args);
            await userService.addPoints(message.author.id, 1);
            logger.logEvent(`Command executed: ${commandName}`);
        } catch (error) {
            logger.logEvent(`Command error: ${error.message}`);
            message.reply('There was an error executing that command.');
        }
    }

    loadCommands() {
        // Load all command modules
        const commandFiles = require('fs').readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            this.commands.set(command.name, command);
        }
    }
}

module.exports = new CommandHandler();
