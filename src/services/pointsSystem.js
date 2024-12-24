const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class PointsSystem {
    constructor() {
        this.pointsPath = path.join(process.cwd(), 'data', 'points.json');
        this.points = {};
        this.loadPoints();
    }

    loadPoints() {
        try {
            if (fs.existsSync(this.pointsPath)) {
                this.points = JSON.parse(fs.readFileSync(this.pointsPath, 'utf8'));
            }
        } catch (error) {
            logger.error('Failed to load points:', error);
        }
    }

    savePoints() {
        try {
            fs.mkdirSync(path.dirname(this.pointsPath), { recursive: true });
            fs.writeFileSync(this.pointsPath, JSON.stringify(this.points, null, 2));
        } catch (error) {
            logger.error('Failed to save points:', error);
        }
    }

    async setPoints(userId, amount) {
        this.points[userId] = amount;
        this.savePoints();
        return this.points[userId];
    }

    async validatePoints(userId) {
        const gameDataSync = require('./gameDataSync');
        const gamePoints = gameDataSync.getPlayerStats(userId)?.points || 0;
        
        if (this.points[userId] !== gamePoints) {
            logger.warn(`Points mismatch for ${userId}. Bot: ${this.points[userId]}, Game: ${gamePoints}`);
            await this.setPoints(userId, gamePoints);
            return false;
        }
        return true;
    }

    async addPoints(userId, amount) {
        await this.validatePoints(userId);
        this.points[userId] = (this.points[userId] || 0) + amount;
        this.savePoints();
        return this.points[userId];
    }

    async removePoints(userId, amount) {
        await this.validatePoints(userId);
        if (!this.points[userId] || this.points[userId] < amount) {
            return false;
        }
        this.points[userId] -= amount;
        this.savePoints();
        return true;
    }

    getPoints(userId) {
        return this.points[userId] || 0;
    }

    getTopPoints(limit = 10) {
        return Object.entries(this.points)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit);
    }
}

module.exports = new PointsSystem();
