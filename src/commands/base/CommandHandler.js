const logger = require('../../utils/logger');
const localization = require('../../localization/LocalizationManager');

class CommandHandler {
    constructor() {
        this.commands = new Map();
    }

    register(command) {
        this.commands.set(command.name, command);
        logger.info(`Registered command: ${command.name}`);
    }

    async handle(message, args) {
        const commandName = args[0];
        const command = this.commands.get(commandName);

        if (!command) {
            return;
        }

        if (!command.checkPermissions(message)) {
            return message.reply(localization.translate('cmd_invalid_perms'));
        }

        const cooldown = command.checkCooldown(message.author.id);
        if (cooldown > 0) {
            return message.reply(localization.translate('cmd_cooldown', { seconds: cooldown }));
        }

        try {
            await command.execute(message, args.slice(1));
        } catch (error) {
            logger.error(`Command execution failed: ${commandName}`, error);
            message.reply(localization.translate('cmd_execution_failed'));
        }
    }
}

module.exports = new CommandHandler();
