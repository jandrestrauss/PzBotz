const logger = require('../utils/logger');
const RedisManager = require('../cache/redisManager');

class ReportHandler {
    constructor(client, config) {
        this.client = client;
        this.redis = new RedisManager();
        this.config = config;
        this.reportChannelId = config.reportChannelId;
        this.reportsKey = 'player_reports';
    }

    async submitReport(reporter, reported, reason, evidence) {
        try {
            const report = {
                id: Date.now().toString(),
                reporter: reporter.id,
                reported: reported,
                reason,
                evidence,
                timestamp: Date.now(),
                status: 'PENDING',
                updates: []
            };

            // Save report
            await this.redis.set(`report:${report.id}`, report);

            // Add to active reports list
            const activeReports = await this.redis.get(this.reportsKey) || [];
            activeReports.push(report.id);
            await this.redis.set(this.reportsKey, activeReports);

            // Send to Discord channel
            await this.notifyReport(report);

            return report.id;
        } catch (error) {
            logger.error('Error submitting report:', error);
            throw error;
        }
    }

    async updateReport(reportId, moderator, action, comment) {
        try {
            const report = await this.redis.get(`report:${reportId}`);
            if (!report) throw new Error('Report not found');

            report.status = action;
            report.updates.push({
                moderator: moderator.id,
                action,
                comment,
                timestamp: Date.now()
            });

            await this.redis.set(`report:${reportId}`, report);
            await this.notifyReportUpdate(report);

            return true;
        } catch (error) {
            logger.error('Error updating report:', error);
            return false;
        }
    }

    async notifyReport(report) {
        const channel = this.client.channels.cache.get(this.reportChannelId);
        if (!channel) return;

        const reporter = await this.client.users.fetch(report.reporter);
        
        const embed = {
            title: `New Player Report - #${report.id}`,
            color: 0xFF0000,
            fields: [
                { name: 'Reporter', value: reporter.tag, inline: true },
                { name: 'Reported Player', value: report.reported, inline: true },
                { name: 'Reason', value: report.reason },
                { name: 'Evidence', value: report.evidence || 'No evidence provided' },
                { name: 'Status', value: report.status }
            ],
            timestamp: new Date()
        };

        await channel.send({ embeds: [embed] });
    }

    async notifyReportUpdate(report) {
        const channel = this.client.channels.cache.get(this.reportChannelId);
        if (!channel) return;

        const update = report.updates[report.updates.length - 1];
        const moderator = await this.client.users.fetch(update.moderator);

        const embed = {
            title: `Report Update - #${report.id}`,
            color: 0xFFA500,
            fields: [
                { name: 'Status', value: report.status, inline: true },
                { name: 'Moderator', value: moderator.tag, inline: true },
                { name: 'Comment', value: update.comment || 'No comment provided' }
            ],
            timestamp: new Date()
        };

        await channel.send({ embeds: [embed] });
    }

    async getActiveReports() {
        return await this.redis.get(this.reportsKey) || [];
    }

    async getReport(reportId) {
        return await this.redis.get(`report:${reportId}`);
    }
}

module.exports = ReportHandler;
