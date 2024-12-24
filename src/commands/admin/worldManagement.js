const Command = require('../base/Command');
const rconService = require('../../services/rconService');
const logger = require('../../utils/logger');

class WorldCommand extends Command {
    constructor() {
        super('world', 'World management commands', { permissions: ['ADMINISTRATOR'] });
    }

    async execute(message, args) {
        if (!args.length) {
            return message.reply('Available commands: time, weather, zombies');
        }

        try {
            switch (args[0].toLowerCase()) {
                case 'time':
                    await this.setTime(message, args[1]);
                    break;
                case 'weather':
                    await this.setWeather(message, args[1]);
                    break;
                case 'zombies':
                    await this.manageZombies(message, args[1]);
                    break;
                default:
                    message.reply('Invalid world command');
            }
        } catch (error) {
            logger.error('World command failed:', error);
            message.reply('Command failed. Check logs for details.');
        }
    }

    async setTime(message, time) {
        if (!time || isNaN(time)) {
            return message.reply('Please provide a valid hour (0-23)');
        }
        await rconService.execute(`settime ${time}`);
        message.reply(`Time set to ${time}:00`);
    }

    async setWeather(message, type) {
        const validTypes = ['clear', 'rain', 'storm'];
        if (!validTypes.includes(type)) {
            return message.reply(`Valid weather types: ${validTypes.join(', ')}`);
        }
        await rconService.execute(`weather ${type}`);
        message.reply(`Weather set to ${type}`);
    }

    async manageZombies(message, action) {
        const validActions = ['clear', 'spawn'];
        if (!validActions.includes(action)) {
            return message.reply(`Valid actions: ${validActions.join(', ')}`);
        }
        await rconService.execute(`zombies ${action}`);
        message.reply(`Zombie action '${action}' executed`);
    }
}

module.exports = new WorldCommand();
