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
        this.applicationManager = require('../core/applicationManager');
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
            const startTime = Date.now();
            this.messageHandler.handle(message)
                .then(success => {
                    this.applicationManager.getService('analytics')
                        .trackCommand({
                            command: message.content.split(' ')[0],
                            userId: message.author.id,
                            success,
                            duration: Date.now() - startTime
                        });
                })
                .catch(error => {
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
