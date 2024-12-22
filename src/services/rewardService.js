const User = require('../models/User');
const logger = require('../utils/logger');

class RewardService {
    constructor() {
        this.rewards = {
            DAILY_BONUS: 100,
            COMMAND_USE: 10,
            PLAYTIME_HOUR: 50
        };
    }

    async grantDailyBonus(discordId) {
        const user = await User.findOne({ discordId });
        if (!user) return null;

        const today = new Date().toDateString();
        const lastBonus = user.lastCommand?.toDateString();

        if (today === lastBonus) {
            return { success: false, message: 'Daily bonus already claimed' };
        }

        user.points += this.rewards.DAILY_BONUS;
        user.lastCommand = new Date();
        await user.save();

        logger.logEvent(`Daily bonus granted to ${user.username}`);
        return { success: true, points: this.rewards.DAILY_BONUS };
    }

    async processPlaytimeReward(discordId, hours) {
        const reward = hours * this.rewards.PLAYTIME_HOUR;
        await User.findOneAndUpdate(
            { discordId },
            { $inc: { points: reward } }
        );
        return reward;
    }
}

module.exports = new RewardService();
