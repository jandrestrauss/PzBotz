const rcon = require('../rcon');
const localization = require('../../config/localization/en.json');

module.exports = {
  name: 'status',
  description: localization.commands.status.description,
  execute(message, args) {
    rcon.send('status');
    rcon.once('response', (str) => {
      message.channel.send(localization.commands.status.response + str);
    });
  }
};