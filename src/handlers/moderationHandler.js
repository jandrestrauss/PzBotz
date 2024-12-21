const logger = require('../utils/logger');
const RedisManager = require('../cache/redisManager');

class ModerationHandler {
    constructor(rcon, config) {
        this.rcon = rcon;
        this.redis = new RedisManager();
        this.config = config;
        this.banListKey = 'pz_banlist';
        this.warningListKey = 'pz_warnings';
    }

    async banPlayer(steamId, reason, duration, moderator) {
        try {
            await this.rcon.sendCommand(`banid ${steamId} ${duration || 0} ${reason}`);
            
            const banEntry = {
                steamId,
                reason,
                duration,
                moderator,
                timestamp: Date.now(),
                expires: duration ? Date.now() + (duration * 60 * 1000) : 0
            };

            await this.redis.set(`ban:${steamId}`, banEntry);
            logger.info(`Player banned: ${steamId}, Reason: ${reason}`);
            return true;
        } catch (error) {
            logger.error('Error banning player:', error);
            return false;
        }
    }

    async unbanPlayer(steamId, moderator) {
        try {
            await this.rcon.sendCommand(`unbanid ${steamId}`);
            await this.redis.delete(`ban:${steamId}`);
            
            logger.info(`Player unbanned: ${steamId} by ${moderator}`);
            return true;
        } catch (error) {
            logger.error('Error unbanning player:', error);
            return false;
        }
    }

    async warnPlayer(steamId, reason, moderator) {
        try {
            const warnings = await this.getPlayerWarnings(steamId) || [];
            warnings.push({
                reason,
                moderator,
                timestamp: Date.now()
            });

            await this.redis.set(`warnings:${steamId}`, warnings);
            
            // Auto-ban if warning threshold reached
            if (warnings.length >= this.config.warningThreshold) {
                await this.banPlayer(
                    steamId, 
                    'Exceeded warning threshold', 
                    this.config.autobanDuration,
                    'System'
                );
            }

            return true;
        } catch (error) {
            logger.error('Error warning player:', error);
            return false;
        }
    }

    async getPlayerWarnings(steamId) {
        return await this.redis.get(`warnings:${steamId}`);
    }

    async getBanInfo(steamId) {
        return await this.redis.get(`ban:${steamId}`);
    }

    async cleanupExpiredBans() {
        try {
            const banPattern = 'ban:*';
            const banKeys = await this.redis.redis.keys(banPattern);
            
            for (const key of banKeys) {
                const ban = await this.redis.get(key);
                if (ban.expires && ban.expires < Date.now()) {
                    const steamId = key.split(':')[1];
                    await this.unbanPlayer(steamId, 'System (Auto-unban)');
                }
            }
        } catch (error) {
            logger.error('Error cleaning up expired bans:', error);
        }
    }
}

module.exports = ModerationHandler;
