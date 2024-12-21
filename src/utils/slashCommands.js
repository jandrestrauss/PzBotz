const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const logger = require('./logger');

class SlashCommandManager {
    constructor(client) {
        this.client = client;
        this.commands = new Map();
        this.rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
    }

    registerCommand(name, description, options = []) {
        this.commands.set(name, {
            name,
            description,
            options,
            type: 1
        });
    }

    async deployCommands(guildId) {
        try {
            logger.info('Started refreshing application (/) commands.');
            
            await this.rest.put(
                Routes.applicationGuildCommands(this.client.user.id, guildId),
                { body: Array.from(this.commands.values()) }
            );

            logger.info('Successfully reloaded application (/) commands.');
        } catch (error) {
            logger.error('Error deploying slash commands:', error);
        }
    }

    setupDefaultCommands() {
        // Server management commands
        this.registerCommand('server', 'Server management commands', [
            {
                name: 'action',
                description: 'Action to perform',
                type: 3,
                required: true,
                choices: [
                    { name: 'status', value: 'status' },
                    { name: 'restart', value: 'restart' },
                    { name: 'backup', value: 'backup' }
                ]
            }
        ]);

        // Player management commands
        this.registerCommand('player', 'Player management commands', [
            {
                name: 'action',
                description: 'Action to perform',
                type: 3,
                required: true,
                choices: [
                    { name: 'kick', value: 'kick' },
                    { name: 'ban', value: 'ban' },
                    { name: 'warn', value: 'warn' }
                ]
            },
            {
                name: 'username',
                description: 'Target player username',
                type: 3,
                required: true
            },
            {
                name: 'reason',
                description: 'Reason for action',
                type: 3,
                required: false
            }
        ]);

        // Economy commands
        this.registerCommand('economy', 'Economy management commands', [
            {
                name: 'action',
                description: 'Action to perform',
                type: 3,
                required: true,
                choices: [
                    { name: 'give', value: 'give' },
                    { name: 'take', value: 'take' },
                    { name: 'check', value: 'check' }
                ]
            },
            {
                name: 'amount',
                description: 'Amount of points',
                type: 4,
                required: false
            }
        ]);
    }
}

module.exports = SlashCommandManager;
