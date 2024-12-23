const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class BackupSystem {
  constructor() {
    this.backupPath = process.env.BACKUP_PATH;
  }

  async startBackupSchedule() {
    // ...existing code...
  }

  async performBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const filePath = path.join(this.backupPath, filename);

    const command = `PGPASSWORD=${process.env.DB_PASS} pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -F c -f ${filePath}`;

    try {
      await this.executeCommand(command);
      await this.rotateBackups();
    } catch (error) {
      console.error('Backup failed:', error);
      await this.sendNotification(error);
    }
  }

  async rotateBackups() {
    const files = fs.readdirSync(this.backupPath)
      .filter(file => file.startsWith('backup-') && file.endsWith('.sql'))
      .sort((a, b) => fs.statSync(path.join(this.backupPath, b)).mtime - fs.statSync(path.join(this.backupPath, a)).mtime);

    const maxBackups = 7; // Keep the latest 7 backups
    for (let i = maxBackups; i < files.length; i++) {
      fs.unlinkSync(path.join(this.backupPath, files[i]));
    }
  }

  async sendNotification(error) {
    // Implement your notification logic here, e.g., send an email or a message to a monitoring system
    console.log('Sending notification about backup failure:', error);
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
