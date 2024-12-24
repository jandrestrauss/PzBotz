const Command = require('../base/Command');
const fs = require('fs');
const path = require('path');

class RestartTimeCommand extends Command {
    constructor() {
        super('restart_time', 'Gets the next automated restart time');
    }

    async execute(message) {
        try {
            const configPath = path.join(__dirname, '../../../config/restart.txt');
            if (!fs.existsSync(configPath)) {
                return message.reply('No scheduled restart configured.');
            }

            const config = fs.readFileSync(configPath, 'utf8');
            const nextRestart = new Date(config);
            
            if (isNaN(nextRestart.getTime())) {
                return message.reply('Invalid restart time configuration.');
            }

            return message.reply(`Next server restart: ${nextRestart.toLocaleString()}`);
        } catch (error) {
            return message.reply('Unable to fetch restart time.');
        }
    }
}

module.exports = new RestartTimeCommand();
