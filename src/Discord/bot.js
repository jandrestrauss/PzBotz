const { Client, Intents } = require('discord.js');
const logger = require('../utils/logger');
const { handleCommand } = require('./commands');

class DiscordBot {
    constructor() {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS
            ]
        });
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('messageCreate', this.handleMessage.bind(this));
        this.client.on('error', error => {
            logger.error('Discord bot error:', error);
        });
    }

    async handleMessage(message) {
        if (message.author.bot) return;
        if (!message.content.startsWith('!')) return;

        const [command, ...args] = message.content.slice(1).split(' ');
        try {
            await handleCommand(command, args, message);
        } catch (error) {
            logger.error('Command error:', error);
            message.reply('An error occurred while processing your command.');
        }
    }

    async start() {
        await this.client.login(process.env.DISCORD_TOKEN);
        logger.info('Discord bot connected');
    }
}

module.exports = new DiscordBot();
