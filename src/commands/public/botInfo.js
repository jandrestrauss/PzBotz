const Command = require('../base/Command');

class BotInfoCommand extends Command {
    constructor() {
        super('bot_info', 'Displays information about this bot');
    }

    async execute(message) {
        return message.reply(`Project Zomboid Discord Bot
- Version: 1.0.0
- Platform: Windows
- Node.js: ${process.version}
- Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    }
}

module.exports = new BotInfoCommand();
