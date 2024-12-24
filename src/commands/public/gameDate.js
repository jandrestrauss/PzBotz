const Command = require('../base/Command');
const rconService = require('../../services/rconService');

class GameDateCommand extends Command {
    constructor() {
        super('game_date', 'Gets the current in-game date');
    }

    async execute(message) {
        try {
            const response = await rconService.execute('getgamedate');
            return message.reply(`Current in-game date: ${response}`);
        } catch (error) {
            return message.reply('Unable to fetch game date. Server might be offline.');
        }
    }
}

module.exports = new GameDateCommand();
