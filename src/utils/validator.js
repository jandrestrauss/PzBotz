const { RateLimiterMemory } = require('rate-limiter-flexible');
const cache = require('./cache');

const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60
});

class Validator {
    static async validateCommand(interaction, command) {
        try {
            await rateLimiter.consume(interaction.user.id);
        } catch {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (!interaction.member.roles.cache.some(role => 
            command.requiredRoles?.includes(role.name))) {
            throw new Error('Insufficient permissions');
        }

        return true;
    }

    static async validateLinkedAccount(discordId, steamId) {
        const account = accountManager.linkedAccounts.get(discordId);
        if (!account || account.steamId !== steamId) {
            throw new Error('Invalid account link');
        }
        return true;
    }

    static validatePoints(points) {
        return Number.isInteger(points) && points >= 0;
    }

    static validateItem(item) {
        return item && typeof item.id === 'string' && 
               typeof item.price === 'number' && item.price > 0;
    }
}

module.exports = Validator;