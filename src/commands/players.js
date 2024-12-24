const rcon = require('../rcon');
const localization = require('../../config/localization/en.json');

module.exports = {
  name: 'players',
  description: localization.commands.players.description,
  execute(message, args) {
    rcon.send('players');
    rcon.once('response', (str) => {
      message.channel.send(localization.commands.players.response + str);
    });
  }
};
