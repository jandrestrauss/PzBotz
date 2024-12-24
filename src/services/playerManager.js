const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const rconService = require('./rconService');

class PlayerManager extends EventEmitter {
    constructor() {
        super();
        this.players = new Map();
        this.configPath = path.join(process.cwd(), 'data', 'players.json');
        this.loadPlayers();
    }

    async loadPlayers() {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                data.forEach(player => this.players.set(player.username, player));
            }
        } catch (error) {
            logger.error('Failed to load player data:', error);
        }
    }

    savePlayers() {
        try {
            const data = Array.from(this.players.values());
            fs.writeFileSync(this.configPath, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error('Failed to save player data:', error);
        }
    }

    async kickPlayer(username, reason) {
        try {
            await rconService.execute(`kick "${username}" "${reason}"`);
            this.emit('playerKicked', { username, reason });
            return true;
        } catch (error) {
            logger.error(`Failed to kick player ${username}:`, error);
            throw error;
        }
    }

    async banPlayer(username, reason) {
        try {
            await rconService.execute(`ban "${username}" "${reason}"`);
            const player = this.players.get(username);
            if (player) {
                player.banned = true;
                player.banReason = reason;
                this.savePlayers();
            }
            this.emit('playerBanned', { username, reason });
            return true;
        } catch (error) {
            logger.error(`Failed to ban player ${username}:`, error);
            throw error;
        }
    }

    async unbanPlayer(username) {
        try {
            await rconService.execute(`unban "${username}"`);
            const player = this.players.get(username);
            if (player) {
                player.banned = false;
                player.banReason = null;
                this.savePlayers();
            }
            this.emit('playerUnbanned', { username });
            return true;
        } catch (error) {
            logger.error(`Failed to unban player ${username}:`, error);
            throw error;
        }
    }

    async getOnlinePlayers() {
        try {
            const response = await rconService.execute('players');
            return this.parsePlayerList(response);
        } catch (error) {
            logger.error('Failed to get online players:', error);
            return [];
        }
    }

    parsePlayerList(response) {
        // Implement parsing logic based on server response format
        return [];
    }
}

module.exports = new PlayerManager();
