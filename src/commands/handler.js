const { Collection } = require('discord.js');
const logger = require('../utils/logger');

class CommandHandler {
    constructor() {
        this.commands = new Collection();
        this.cooldowns = new Collection();
    }

    registerCommand(command) {
        this.commands.set(command.name, {
            ...command,
            cooldown: command.cooldown || 3
        });
        logger.info(`Command registered: ${command.name}`);
    }

    async handleCommand(message, args, client) {
        const command = this.commands.get(args[0]);
        
        if (!command) return;
        if (!this.checkPermissions(message.member, command)) {
            return message.reply('You do not have permission to use this command.');
        }
        
        if (this.checkCooldown(message.author.id, command)) {
            return message.reply('Please wait before using this command again.');
        }

        try {
            await command.execute(message, args.slice(1), client);
        } catch (error) {
            logger.error(`Command execution error: ${command.name}`, error);
            message.reply('There was an error executing that command.');
        }
    }

    checkPermissions(member, command) {
        return !command.permissions || member.permissions.has(command.permissions);
    }

    checkCooldown(userId, command) {
        if (!this.cooldowns.has(command.name)) {
            this.cooldowns.set(command.name, new Collection());
        }

        const timestamps = this.cooldowns.get(command.name);
        const now = Date.now();
        const cooldownAmount = command.cooldown * 1000;

        if (timestamps.has(userId)) {
            const expirationTime = timestamps.get(userId) + cooldownAmount;
            if (now < expirationTime) return true;
        }

        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldownAmount);
        return false;
    }
}

module.exports = new CommandHandler();
