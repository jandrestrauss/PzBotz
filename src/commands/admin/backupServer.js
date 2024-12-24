const Command = require('../base/Command');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const logger = require('../../utils/logger');

class BackupServerCommand extends Command {
    constructor() {
        super('backup_server', 'Creates a backup of the server');
    }

    async execute(message) {
        const backupDir = path.join(__dirname, '../../../backups');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup-${timestamp}`);

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        message.reply('Starting server backup...');

        exec(`xcopy /E /I /Y "Zomboid" "${backupPath}"`, (error) => {
            if (error) {
                logger.error('Backup failed:', error);
                return message.reply('Failed to create backup.');
            }
            message.reply(`Backup completed successfully at: ${backupPath}`);
        });
    }
}

module.exports = new BackupServerCommand();
