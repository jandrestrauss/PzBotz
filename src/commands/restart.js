const rcon = require('../rcon');
const localization = require('../../config/localization/en.json');
const { botSettings } = require('../../config/config.json');

module.exports = {
  name: 'restart',
  description: localization.commands.restart.description,
  execute(message, args) {
    if (!message.member.roles.cache.some(role => botSettings.adminRoles.includes(role.name))) {
      return message.reply(localization.commands.restart.no_permission);
    }

    rcon.send('servermsg "Server is restarting..."');
    rcon.send('quit');
    message.channel.send(localization.commands.restart.success);
  }
};
