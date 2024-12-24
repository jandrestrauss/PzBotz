const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const BaseService = require('./BaseService');
const rconService = require('./rconService');

class WheelSpinService extends BaseService {
    constructor() {
        super('WheelSpin', 'wheel.json');
    }

    async spin(username) {
        const rewards = Array.from(this.data.values());
        if (rewards.length === 0) throw new Error('No rewards configured');

        const reward = this.getRandomReward(rewards);
        try {
            await rconService.execute(`additem "${username}" "${reward.id}" ${reward.quantity}`);
            this.emit('spinComplete', { username, reward });
            return reward;
        } catch (error) {
            this.emit('spinFailed', { username, error });
            throw error;
        }
    }

    getRandomReward(rewards) {
        const totalWeight = rewards.reduce((sum, r) => sum + (r.weight || 1), 0);
        let random = Math.random() * totalWeight;
        
        for (const reward of rewards) {
            random -= (reward.weight || 1);
            if (random <= 0) return reward;
        }
        return rewards[0];
    }
}

module.exports = new WheelSpinService();
