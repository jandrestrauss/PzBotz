const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const { serverSettings, botSettings } = require('../config/config.json');
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Load command files
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('message', message => {
  if (!message.content.startsWith(botSettings.prefix) || message.author.bot) return;

  const args = message.content.slice(botSettings.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

client.login('your_discord_bot_token_here');
