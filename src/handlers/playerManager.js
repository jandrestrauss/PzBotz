const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

class PlayerManager {
    constructor(rcon) {
        this.rcon = rcon;
        this.players = new Map();
        this.statsPath = path.join(__dirname, '../data/playerStats.json');
        this.loadStats();
    }

    async loadStats() {
        try {
            const data = await fs.readFile(this.statsPath, 'utf8');
            const stats = JSON.parse(data);
            stats.forEach((stat, id) => this.players.set(id, stat));
        } catch (error) {
            logger.warn('No player stats found, creating new file');
            await this.saveStats();
        }
    }

    async saveStats() {
        try {
            const data = Object.fromEntries(this.players);
            await fs.writeFile(this.statsPath, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error('Failed to save player stats:', error);
        }
    }

    async updatePlayerStats(playerId, stats) {
        const player = this.players.get(playerId) || {};
        this.players.set(playerId, {
            ...player,
            ...stats,
            lastUpdated: Date.now()
        });
        await this.saveStats();
    }

    async getPlayerStats(playerId) {
        return this.players.get(playerId) || null;
    }

    async getAllPlayers() {
        try {
            const response = await this.rcon.sendCommand('players');
            return this.parsePlayerList(response);
        } catch (error) {
            logger.error('Failed to get player list:', error);
            return [];
        }
    }

    async kickPlayer(username, reason) {
        try {
            await this.rcon.sendCommand(`kick "${username}" "${reason}"`);
            logger.info(`Kicked player: ${username} (${reason})`);
            return true;
        } catch (error) {
            logger.error(`Failed to kick player ${username}:`, error);
            return false;
        }
    }

    async banPlayer(username, reason) {
        try {
            await this.rcon.sendCommand(`ban "${username}" "${reason}"`);
            logger.info(`Banned player: ${username} (${reason})`);
            return true;
        } catch (error) {
            logger.error(`Failed to ban player ${username}:`, error);
            return false;
        }
    }

    parsePlayerList(response) {
        return response.split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [name, steamId] = line.split(' - ');
                return { name: name.trim(), steamId: steamId?.trim() };
            });
    }
}

module.exports = PlayerManager;
