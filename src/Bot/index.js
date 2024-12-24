const { Client, GatewayIntentBits } = require('discord.js');
const logger = require('../utils/logger');
const config = require('../config/config');

class DiscordBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        this.messageHandler = require('./messageHandler');
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            logger.info(`Bot logged in as ${this.client.user.tag}`);
        });

        this.client.on('error', (error) => {
            logger.error('Discord client error:', error);
        });

        this.client.on('messageCreate', (message) => {
            this.messageHandler.handle(message).catch(error => {
                logger.error('Message handling error:', error);
            });
        });
    }

    async start() {
        try {
            await this.client.login(process.env.DISCORD_TOKEN);
        } catch (error) {
            logger.error('Failed to start Discord bot:', error);
            process.exit(1);
        }
    }
}

module.exports = new DiscordBot();
