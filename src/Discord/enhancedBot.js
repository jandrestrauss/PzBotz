const { Client, Intents } = require('discord.js');
const analyticsService = require('../analytics/analyticsService');
const gameServer = require('../integration/gameServer');

class EnhancedBot extends Client {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS
            ]
        });

        this.setupEventHandlers();
        this.commandHistory = new Map();
    }

    setupEventHandlers() {
        this.on('messageCreate', this.handleMessage.bind(this));
        this.on('interactionCreate', this.handleInteraction.bind(this));
    }

    async handleMessage(message) {
        if (message.author.bot) return;
        analyticsService.trackEvent('discord_message', {
            userId: message.author.id,
            channelId: message.channel.id
        });
    }
}

module.exports = EnhancedBot;
