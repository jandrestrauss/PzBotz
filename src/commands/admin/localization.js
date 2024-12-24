const Command = require('../base/Command');
const localization = require('../../localization/LocalizationManager');
const logger = require('../../utils/logger');

class LocalizationCommand extends Command {
    constructor() {
        super('localization', 'Get or change current localization');
    }

    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply(localization.translate('cmd_invalid_perms'));
        }

        if (args.length === 0) {
            const availableLocales = localization.getAvailableLocales();
            const currentLocale = localization.currentLocale;
            return message.reply(
                `Current localization: ${currentLocale}\n` +
                `Available localizations: ${availableLocales.join(', ')}`
            );
        }

        const newLocale = args[0];
        if (localization.setLocale(newLocale)) {
            logger.info(`Localization changed to ${newLocale}`);
            return message.reply(`Localization changed to ${newLocale}`);
        } else {
            return message.reply(`Invalid localization. Available: ${localization.getAvailableLocales().join(', ')}`);
        }
    }
}

module.exports = new LocalizationCommand();
