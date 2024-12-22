const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');

class UserService {
    async findOrCreateUser(discordId, username) {
        let user = await User.findOne({ discordId });
        
        if (!user) {
            user = new User({
                discordId,
                username,
                role: 'user'
            });
            await user.save();
        }
        
        return user;
    }

    async addPoints(discordId, points) {
        const user = await User.findOne({ discordId });
        if (!user) throw new AppError('User not found', 404);
        
        user.points += points;
        await user.save();
        return user;
    }

    async linkSteamId(discordId, steamId) {
        const user = await User.findOneAndUpdate(
            { discordId },
            { steamId },
            { new: true }
        );
        
        if (!user) throw new AppError('User not found', 404);
        return user;
    }
}

module.exports = new UserService();
