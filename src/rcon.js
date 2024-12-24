const Rcon = require('rcon');
const { serverSettings } = require('../config/config.json');
require('dotenv').config();

const rcon = new Rcon('localhost', serverSettings.rconPort, process.env.RCON_PASSWORD);

rcon.on('auth', () => {
  console.log('Authenticated!');
}).on('response', (str) => {
  console.log('Response: ' + str);
}).on('end', () => {
  console.log('Socket closed!');
});

rcon.connect();

module.exports = rcon;
