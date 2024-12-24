const rconService = require('./rconService');
const pointsSystem = require('./pointsSystem');
const logger = require('../utils/logger');

class GameDataSync {
    constructor() {
        this.syncInterval = null;
        this.userCache = new Map();
    }

    start() {
        // Sync every 5 minutes
        this.syncInterval = setInterval(() => this.syncGameData(), 300000);
        logger.logEvent('Game data sync service started');
    }

    stop() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    async syncGameData() {
        try {
            const gameData = await this.fetchGameData();
            await this.validateAndUpdatePoints(gameData);
            logger.logEvent('Game data sync completed');
        } catch (error) {
            logger.error('Game data sync failed:', error);
        }
    }

    async fetchGameData() {
        const response = await rconService.execute('players');
        return this.parsePlayerData(response);
    }

    parsePlayerData(data) {
        // Format depends on your PZ server output
        // Example: "Username=Points"
        const players = new Map();
        const lines = data.split('\n');
        
        for (const line of lines) {
            if (line.includes('=')) {
                const [username, points] = line.split('=');
                players.set(username.trim(), parseInt(points, 10) || 0);
            }
        }
        
        return players;
    }

    async validateAndUpdatePoints(gameData) {
        for (const [username, gamePoints] of gameData) {
            const storedPoints = pointsSystem.getPoints(username);
            
            if (storedPoints !== gamePoints) {
                logger.logEvent(`Points mismatch for ${username}: stored=${storedPoints}, game=${gamePoints}`);
                await pointsSystem.setPoints(username, gamePoints);
            }
        }
    }

    getPlayerStats(username) {
        return this.userCache.get(username);
    }
}

module.exports = new GameDataSync();
