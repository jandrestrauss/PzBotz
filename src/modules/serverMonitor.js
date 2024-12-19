const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const path = require('path');
const fs = require('fs-extra');
const rcon = require('../utils/rcon');
const cache = require('../utils/cache');

class ServerMonitor {
    constructor() {
        this.backupPath = path.join(__dirname, '../../backups');
        this.stats = cache;
    }

    async createBackup() {
        const date = new Date().toISOString().replace(/:/g, '-');
        const backupDir = path.join(this.backupPath, date);
        
        await fs.ensureDir(backupDir);
        await rcon.sendCommand('save');
        
        // Copy server files
        await fs.copy(process.env.PZ_SERVER_PATH, backupDir);
        return backupDir;
    }

    async getServerStatus() {
        const cachedStats = this.stats.get('serverStats');
        if (cachedStats) return cachedStats;

        const stats = {
            players: await rcon.sendCommand('players'),
            memory: await rcon.sendCommand('stats'),
            uptime: await rcon.sendCommand('uptime')
        };

        this.stats.set('serverStats', stats, 60); // Cache for 1 minute
        return stats;
    }

    createDashboard(stats) {
        return new MessageEmbed()
            .setTitle('🧟 Server Dashboard')
            .setColor('#FF0000')
            .addField('Players Online', stats.players || '0', true)
            .addField('Memory Usage', stats.memory || 'N/A', true)
            .addField('Uptime', stats.uptime || 'N/A', true)
            .setTimestamp();
    }

    scheduleBackups() {
        // Backup every 6 hours
        schedule.scheduleJob('0 */6 * * *', this.createBackup.bind(this));
    }
}

module.exports = new ServerMonitor();