const fs = require('fs').promises;
const path = require('path');

class PointsSystem {
    constructor() {
        this.pointsFile = path.join(__dirname, '../../data/points.json');
        this.points = {};
        this.loadPoints();
    }

    async loadPoints() {
        try {
            const data = await fs.readFile(this.pointsFile, 'utf8');
            this.points = JSON.parse(data);
        } catch (error) {
            console.error('Error loading points:', error);
            this.points = {};
        }
    }

    async savePoints() {
        try {
            await fs.writeFile(this.pointsFile, JSON.stringify(this.points, null, 2));
        } catch (error) {
            console.error('Error saving points:', error);
        }
    }

    async addPoints(userId, amount) {
        this.points[userId] = (this.points[userId] || 0) + amount;
        await this.savePoints();
        return this.points[userId];
    }

    async getPoints(userId) {
        return this.points[userId] || 0;
    }

    async deductPoints(userId, amount) {
        if ((this.points[userId] || 0) >= amount) {
            this.points[userId] -= amount;
            await this.savePoints();
            return true;
        }
        return false;
    }
}

module.exports = new PointsSystem();