const Command = require('../base/Command');
const healthMonitor = require('../../services/healthMonitor');
const logAnalyzer = require('../../services/logAnalyzer');
const { MessageEmbed } = require('discord.js');

class HealthCommand extends Command {
    constructor() {
        super('health', 'View server health status', { permissions: ['ADMINISTRATOR'] });
    }

    async execute(message, args) {
        try {
            await healthMonitor.runHealthChecks();
            const status = healthMonitor.getStatus();
            const logStats = await logAnalyzer.analyze();

            const embed = new MessageEmbed()
                .setTitle('Server Health Status')
                .setColor(status.serverRunning ? '#00ff00' : '#ff0000')
                .addField('Server Status', status.serverRunning ? 'Running' : 'Stopped')
                .addField('Disk Space Used', `${status.diskSpace}%`)
                .addField('Last Check', status.lastCheck ? status.lastCheck.toLocaleString() : 'Never')
                .addField('Log Analysis', 
                    `Errors: ${logStats.errors}\n` +
                    `Warnings: ${logStats.warnings}\n` +
                    `Crashes: ${logStats.crashes}`
                );

            return message.reply({ embeds: [embed] });
        } catch (error) {
            return message.reply('Failed to get health status');
        }
    }
}

module.exports = new HealthCommand();
