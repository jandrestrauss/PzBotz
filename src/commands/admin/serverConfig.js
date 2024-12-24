const Command = require('../base/Command');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

class ServerConfigCommand extends Command {
    constructor() {
        super('config', 'Server configuration commands', { permissions: ['ADMINISTRATOR'] });
        this.configPath = path.join(process.cwd(), 'config', 'server-settings.ini');
    }

    async execute(message, args) {
        if (!args.length) {
            return message.reply('Usage: !config <view|set> [setting] [value]');
        }

        switch (args[0].toLowerCase()) {
            case 'view':
                await this.viewConfig(message);
                break;
            case 'set':
                if (args.length < 3) {
                    return message.reply('Usage: !config set <setting> <value>');
                }
                await this.setConfig(message, args[1], args.slice(2).join(' '));
                break;
            default:
                message.reply('Invalid subcommand. Use view or set.');
        }
    }

    async viewConfig(message) {
        try {
            const config = fs.readFileSync(this.configPath, 'utf8');
            const important = this.parseImportantSettings(config);
            message.reply('Current server configuration:\n```' + important + '```');
        } catch (error) {
            logger.error('Error reading config:', error);
            message.reply('Failed to read server configuration');
        }
    }

    async setConfig(message, setting, value) {
        try {
            let config = fs.readFileSync(this.configPath, 'utf8');
            const newConfig = this.updateSetting(config, setting, value);
            fs.writeFileSync(this.configPath, newConfig);
            message.reply(`Updated ${setting} to ${value}`);
        } catch (error) {
            logger.error('Error updating config:', error);
            message.reply('Failed to update configuration');
        }
    }

    parseImportantSettings(config) {
        // Extract important settings from config file
        return config.split('\n')
            .filter(line => line.includes('='))
            .map(line => line.trim())
            .join('\n');
    }

    updateSetting(config, setting, value) {
        return config.replace(
            new RegExp(`^${setting}=.*$`, 'm'),
            `${setting}=${value}`
        );
    }
}

module.exports = new ServerConfigCommand();
