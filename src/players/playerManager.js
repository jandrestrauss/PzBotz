const EventEmitter = require('events');
const Player = require('../database/models/Player');
const logger = require('../utils/logger');

class PlayerManager extends EventEmitter {
    constructor() {
        super();
        this.activePlayers = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Listen for player events from the server
        ZomboidServer.on('playerJoin', this.handlePlayerJoin.bind(this));
        ZomboidServer.on('playerLeave', this.handlePlayerLeave.bind(this));
    }

    async handlePlayerJoin(steamId, playerData) {
        try {
            let player = await Player.findOne({ steamId });
            if (!player) {
                player = new Player({ steamId, ...playerData });
            }
            player.lastJoin = new Date();
            player.online = true;
            await player.save();

            this.activePlayers.set(steamId, player);
            this.emit('playerJoined', player);
        } catch (error) {
            logger.error('Error handling player join:', error);
            throw error;
        }
    }

    async handlePlayerLeave(steamId) {
        try {
            const player = this.activePlayers.get(steamId);
            if (player) {
                player.online = false;
                player.lastLeave = new Date();
                player.updatePlaytime();
                await player.save();

                this.activePlayers.delete(steamId);
                this.emit('playerLeft', player);
            }
        } catch (error) {
            logger.error('Error handling player leave:', error);
            throw error;
        }
    }

    async getPlayerStats(steamId) {
        const player = await Player.findOne({ steamId });
        return player ? this.calculatePlayerStats(player) : null;
    }

    calculatePlayerStats(player) {
        const playtimeHours = (player.playtime / 3600).toFixed(2);
        return {
            username: player.username,
            playtime: `${playtimeHours} hours`,
            lastJoin: player.lastJoin,
            lastLeave: player.lastLeave,
            online: player.online
        };
    }
}

module.exports = new PlayerManager();
