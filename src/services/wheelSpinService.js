const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const rconService = require('./rconService');

class WheelSpinService {
    constructor() {
        this.configPath = path.join(process.cwd(), 'config', 'wheel.json');
        this.rewards = [];
        this.loadRewards();
    }

    loadRewards() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.rewards = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            }
        } catch (error) {
            logger.error('Error loading wheel rewards:', error);
        }
    }

    async spin(username) {
        if (this.rewards.length === 0) {
            throw new Error('No rewards configured');
        }

        const reward = this.rewards[Math.floor(Math.random() * this.rewards.length)];
        try {
            await rconService.execute(`additem "${username}" "${reward.id}" ${reward.quantity}`);
            return reward;
        } catch (error) {
            logger.error(`Failed to give reward to ${username}:`, error);
            throw error;
        }
    }

    getRewards() {
        return this.rewards;
    }
}

module.exports = new WheelSpinService();
