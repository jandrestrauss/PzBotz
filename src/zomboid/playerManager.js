const EventEmitter = require('events');
const logger = require('../utils/logger');
const rcon = require('./rconHandler');

class PlayerManager extends EventEmitter {
    constructor() {
        super();
        this.players = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Listen for player events from RCON
        rcon.on('playerConnected', this.handlePlayerConnect.bind(this));
        rcon.on('playerDisconnected', this.handlePlayerDisconnect.bind(this));
    }

    async kickPlayer(steamId, reason) {
        try {
            await rcon.executeCommand(`kickuser ${steamId} "${reason}"`);
            logger.logEvent(`Player ${steamId} kicked: ${reason}`);
            return true;
        } catch (error) {
            logger.logEvent(`Failed to kick player: ${error.message}`);
            throw error;
        }
    }

    async getPlayerStats(steamId) {
        const player = this.players.get(steamId);
        if (!player) return null;

        return {
            ...player,
            timePlayed: this.calculatePlayTime(player),
            lastSeen: player.lastSeen || new Date()
        };
    }
}

module.exports = new PlayerManager();
