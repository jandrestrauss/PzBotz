const logger = require('./utils/logger');
const playerStats = require('./playerStats');

class EventHandler {
    constructor() {
        this.handlers = new Map();
        this.setupDefaultHandlers();
    }

    setupDefaultHandlers() {
        this.registerHandler('playerDeath', async (data) => {
            const stats = await playerStats.getPlayerStats(data.playerId);
            await playerStats.updateStats(data.playerId, {
                ...stats,
                deaths: (stats?.deaths || 0) + 1
            });
        });

        this.registerHandler('zombieKill', async (data) => {
            const stats = await playerStats.getPlayerStats(data.playerId);
            await playerStats.updateStats(data.playerId, {
                ...stats,
                zombiesKilled: (stats?.zombiesKilled || 0) + 1
            });
        });

        this.registerHandler('playerStatsUpdate', async (data) => {
            const stats = await playerStats.getPlayerStats(data.playerId);
            await playerStats.updateStats(data.playerId, {
                ...stats,
                ...data.stats
            });
        });
    }

    registerHandler(eventName, handler) {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        this.handlers.get(eventName).push(handler);
    }

    async handleEvent(eventName, data) {
        try {
            const handlers = this.handlers.get(eventName) || [];
            await Promise.all(handlers.map(handler => handler(data)));
        } catch (error) {
            logger.error(`Error handling event ${eventName}:`, error);
        }
    }
}

module.exports = new EventHandler();
