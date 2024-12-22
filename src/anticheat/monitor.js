const logger = require('../utils/logger');
const eventHandler = require('../eventHandler');

class AntiCheatMonitor {
    constructor() {
        this.suspiciousActivities = new Map();
        this.thresholds = {
            speedHack: 25,
            itemSpawn: 100,
            teleport: 5
        };
    }

    initialize() {
        eventHandler.registerHandler('playerMove', this.checkSpeedHack.bind(this));
        eventHandler.registerHandler('itemSpawn', this.checkItemSpawning.bind(this));
        eventHandler.registerHandler('playerTeleport', this.checkTeleport.bind(this));
        
        setInterval(() => this.resetCounts(), 60000);
    }

    async checkSpeedHack(data) {
        const { playerId, speed } = data;
        if (speed > this.thresholds.speedHack) {
            await this.flagSuspiciousActivity(playerId, 'speedHack');
        }
    }

    async checkItemSpawning(data) {
        const { playerId, itemCount } = data;
        if (itemCount > this.thresholds.itemSpawn) {
            await this.flagSuspiciousActivity(playerId, 'itemSpawn');
        }
    }

    async flagSuspiciousActivity(playerId, type) {
        const key = `${playerId}-${type}`;
        const count = (this.suspiciousActivities.get(key) || 0) + 1;
        this.suspiciousActivities.set(key, count);

        if (count >= 3) {
            await this.triggerAntiCheatResponse(playerId, type);
        }
    }

    async triggerAntiCheatResponse(playerId, type) {
        logger.warn(`Anti-cheat triggered for player ${playerId}: ${type}`);
        // Implement response actions (warning, kick, ban, etc.)
    }

    resetCounts() {
        this.suspiciousActivities.clear();
    }
}

module.exports = new AntiCheatMonitor();
