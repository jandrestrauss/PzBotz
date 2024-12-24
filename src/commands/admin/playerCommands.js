const Command = require('../base/Command');
const playerManager = require('../../services/playerManager');
const { MessageEmbed } = require('discord.js');

class PlayerCommand extends Command {
    constructor() {
        super('player', 'Manage players', {
            permissions: ['ADMINISTRATOR'],
            subcommands: ['list', 'kick', 'ban', 'unban']
        });
    }

    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();
        const username = args[1];
        const reason = args.slice(2).join(' ') || 'No reason provided';

        try {
            switch(subcommand) {
                case 'list':
                    await this.listPlayers(message);
                    break;
                case 'kick':
                    if (!username) return message.reply('Please specify a username');
                    await this.kickPlayer(message, username, reason);
                    break;
                case 'ban':
                    if (!username) return message.reply('Please specify a username');
                    await this.banPlayer(message, username, reason);
                    break;
                case 'unban':
                    if (!username) return message.reply('Please specify a username');
                    await this.unbanPlayer(message, username);
                    break;
                default:
                    await message.reply('Available commands: list, kick, ban, unban');
            }
        } catch (error) {
            await message.reply('Command failed. Check logs for details.');
        }
    }

    async listPlayers(message) {
        const players = await playerManager.getOnlinePlayers();
        const embed = new MessageEmbed()
            .setTitle('Online Players')
            .setColor('#0099ff')
            .setDescription(players.length ? players.join('\n') : 'No players online')
            .setFooter({ text: `Total: ${players.length}` });

        await message.reply({ embeds: [embed] });
    }

    async kickPlayer(message, username, reason) {
        await playerManager.kickPlayer(username, reason);
        await message.reply(`Kicked player: ${username}\nReason: ${reason}`);
    }

    async banPlayer(message, username, reason) {
        await playerManager.banPlayer(username, reason);
        await message.reply(`Banned player: ${username}\nReason: ${reason}`);
    }

    async unbanPlayer(message, username) {
        await playerManager.unbanPlayer(username);
        await message.reply(`Unbanned player: ${username}`);
    }
}

module.exports = new PlayerCommand();
