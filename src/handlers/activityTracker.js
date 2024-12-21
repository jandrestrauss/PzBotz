const logger = require('../utils/logger');
const ServerStats = require('../database/models/ServerStats');
const User = require('../database/models/User');

class ActivityTracker {
    constructor(bot) {
        this.bot = bot;
        this.activeUsers = new Map();
        this.trackingInterval = null;
    }

    startTracking() {
        this.trackingInterval = setInterval(() => this.updateStats(), 5 * 60 * 1000); // Update every 5 minutes
    }

    stopTracking() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
    }

    async updateStats() {
        try {
            const onlinePlayers = await this.bot.serverManager.getOnlinePlayers();
            const currentTime = Date.now();

            // Update playtime for each player
            for (const player of onlinePlayers) {
                const startTime = this.activeUsers.get(player.steamId) || currentTime;
                const playtime = Math.floor((currentTime - startTime) / 1000 / 60); // Convert to minutes

                await User.findOneAndUpdate(
                    { 'gameAccounts.steamId': player.steamId },
                    { 
                        $inc: { 'stats.playtime': playtime },
                        $set: { 'gameAccounts.$.lastSeen': new Date() }
                    }
                );
            }

            // Save server statistics
            await ServerStats.create({
                timestamp: new Date(),
                players: {
                    online: onlinePlayers.length,
                    peak: Math.max(onlinePlayers.length, (await this.getDailyPeak())),
                    unique: await this.getUniquePlayersToday()
                },
                performance: await this.bot.serverManager.getPerformanceStats()
            });

        } catch (error) {
            logger.error('Error updating activity stats:', error);
        }
    }

    async getDailyPeak() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await ServerStats.findOne({
            timestamp: { $gte: today }
        }, {
            'players.peak': 1
        }).sort({ 'players.peak': -1 });

        return stats?.players?.peak || 0;
    }

    async getUniquePlayersToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const uniquePlayers = await User.countDocuments({
            'gameAccounts.lastSeen': { $gte: today }
        });

        return uniquePlayers;
    }

    playerJoined(steamId) {
        this.activeUsers.set(steamId, Date.now());
    }

    playerLeft(steamId) {
        this.activeUsers.delete(steamId);
    }
}

module.exports = ActivityTracker;
