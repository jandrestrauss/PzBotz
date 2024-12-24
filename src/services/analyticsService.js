const logger = require('../utils/logger');
const eventManager = require('./eventManager');

class AnalyticsService {
    constructor() {
        this.stats = {
            commands: new Map(),
            events: new Map(),
            players: new Map()
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        eventManager.on('commandExecuted', this.trackCommand.bind(this));
        eventManager.on('playerJoin', this.trackPlayerActivity.bind(this));
        eventManager.on('playerLeave', this.trackPlayerActivity.bind(this));
    }

    trackCommand(data) {
        const { command, userId, success, duration } = data;
        if (!this.stats.commands.has(command)) {
            this.stats.commands.set(command, {
                uses: 0,
                failures: 0,
                totalDuration: 0
            });
        }

        const stats = this.stats.commands.get(command);
        stats.uses++;
        stats.totalDuration += duration;
        if (!success) stats.failures++;
    }

    trackPlayerActivity(data) {
        const { playerId, event, timestamp } = data;
        if (!this.stats.players.has(playerId)) {
            this.stats.players.set(playerId, {
                joins: 0,
                totalTime: 0,
                lastJoin: null
            });
        }

        const stats = this.stats.players.get(playerId);
        if (event === 'join') {
            stats.joins++;
            stats.lastJoin = timestamp;
        } else if (event === 'leave' && stats.lastJoin) {
            stats.totalTime += timestamp - stats.lastJoin;
            stats.lastJoin = null;
        }
    }

    getCommandStats(command = null) {
        if (command) {
            return this.stats.commands.get(command);
        }
        return Object.fromEntries(this.stats.commands);
    }

    getPlayerStats(playerId = null) {
        if (playerId) {
            return this.stats.players.get(playerId);
        }
        return Object.fromEntries(this.stats.players);
    }

    generateAnalytics() {
        return {
            commands: this.getCommandStats(),
            players: this.getPlayerStats(),
            events: Object.fromEntries(this.stats.events)
        };
    }
}

module.exports = new AnalyticsService();
