const logger = require('../utils/logger');

class CommandValidator {
    constructor(client) {
        this.client = client;
        this.commandConfigs = new Map();
    }

    registerCommand(command, config) {
        this.commandConfigs.set(command, {
            minArgs: config.minArgs || 0,
            maxArgs: config.maxArgs || Infinity,
            usage: config.usage || '',
            example: config.example || '',
            allowedChannels: config.allowedChannels || [],
            requiredRole: config.requiredRole || null,
            cooldown: config.cooldown || 0
        });
    }

    validateArgs(message, command, args) {
        const config = this.commandConfigs.get(command);
        if (!config) return true;

        if (args.length < config.minArgs) {
            message.reply(`Insufficient arguments. Usage: ${config.usage}\nExample: ${config.example}`);
            return false;
        }

        if (args.length > config.maxArgs) {
            message.reply(`Too many arguments. Usage: ${config.usage}\nExample: ${config.example}`);
            return false;
        }

        return true;
    }

    validateChannel(message, command) {
        const config = this.commandConfigs.get(command);
        if (!config || !config.allowedChannels.length) return true;

        if (!config.allowedChannels.includes(message.channel.id)) {
            message.reply(`This command can only be used in specific channels.`);
            return false;
        }

        return true;
    }

    getMiddleware() {
        return async (message, command, args) => {
            const isArgsValid = this.validateArgs(message, command, args);
            if (!isArgsValid) return false;

            const isChannelValid = this.validateChannel(message, command);
            if (!isChannelValid) return false;

            logger.debug(`Command ${command} validated successfully for ${message.author.tag}`);
            return true;
        };
    }
}

module.exports = CommandValidator;
