const Command = require('../base/Command');
const backupScheduler = require('../../services/backupScheduler');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

class BackupCommand extends Command {
    constructor() {
        super('backup', 'Manage server backups', {
            permissions: ['ADMINISTRATOR'],
            subcommands: ['create', 'list', 'info']
        });
    }

    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();

        switch (subcommand) {
            case 'create':
                await this.createBackup(message);
                break;
            case 'list':
                await this.listBackups(message);
                break;
            case 'info':
                await this.backupInfo(message, args[1]);
                break;
            default:
                await message.reply('Available commands: create, list, info');
        }
    }

    async createBackup(message) {
        try {
            await message.reply('Creating backup...');
            const backupPath = await backupScheduler.createBackup();
            await message.reply(`Backup created successfully: ${path.basename(backupPath)}`);
        } catch (error) {
            await message.reply('Failed to create backup. Check logs for details.');
        }
    }

    async listBackups(message) {
        const backupDir = backupScheduler.backupDir;
        const files = fs.readdirSync(backupDir)
            .filter(file => file.startsWith('backup-'))
            .map(file => ({
                name: file,
                size: fs.statSync(path.join(backupDir, file)).size,
                date: fs.statSync(path.join(backupDir, file)).mtime
            }))
            .sort((a, b) => b.date - a.date);

        const embed = new MessageEmbed()
            .setTitle('Server Backups')
            .setColor('#0099ff')
            .addFields(
                files.map(file => ({
                    name: file.name,
                    value: `Size: ${(file.size / 1024 / 1024).toFixed(2)}MB\nDate: ${file.date.toLocaleString()}`
                }))
            );

        await message.reply({ embeds: [embed] });
    }

    async backupInfo(message, backupName) {
        if (!backupName) {
            return message.reply('Please specify a backup name');
        }

        const backupPath = path.join(backupScheduler.backupDir, backupName);
        if (!fs.existsSync(backupPath)) {
            return message.reply('Backup not found');
        }

        const stats = fs.statSync(backupPath);
        const embed = new MessageEmbed()
            .setTitle('Backup Information')
            .setColor('#0099ff')
            .addFields([
                { name: 'Name', value: backupName },
                { name: 'Size', value: `${(stats.size / 1024 / 1024).toFixed(2)}MB` },
                { name: 'Created', value: stats.mtime.toLocaleString() }
            ]);

        await message.reply({ embeds: [embed] });
    }
}

module.exports = new BackupCommand();
