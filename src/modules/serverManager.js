const rcon = require('../utils/rcon');
const schedule = require('node-schedule');
const logger = require('../utils/logger');
const fs = require('fs-extra');
const path = require('path');

class ServerManager {
    constructor() {
        this.restartJobs = new Map();
        this.backupDir = path.join(__dirname, '../../backups');
    }

    async restartServer() {
        try {
            await this.broadcastMessage('Server restart in 5 minutes');
            await new Promise(r => setTimeout(r, 240000));
            await this.broadcastMessage('Server restart in 1 minute');
            await new Promise(r => setTimeout(r, 30000));
            await this.broadcastMessage('Server restarting now...');
            await rcon.sendCommand('quit');
            logger.info('Server restart completed');
        } catch (error) {
            logger.error('Restart failed:', error);
            throw error;
        }
    }

    setRestartSchedule(times) {
        this.clearSchedule();
        times.forEach(time => {
            const job = schedule.scheduleJob(time, () => this.restartServer());
            this.restartJobs.set(time, job);
        });
        logger.info('Restart schedule set:', times);
    }

    clearSchedule() {
        this.restartJobs.forEach(job => job.cancel());
        this.restartJobs.clear();
    }

    async broadcastMessage(message) {
        return await rcon.sendCommand(`servermsg "${message}"`);
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, timestamp);
        
        await fs.ensureDir(backupPath);
        await this.broadcastMessage('Creating server backup...');
        await rcon.sendCommand('save');
        
        try {
            await fs.copy(process.env.PZ_SERVER_PATH, backupPath);
            logger.info(`Backup created at ${backupPath}`);
            return backupPath;
        } catch (error) {
            logger.error('Backup failed:', error);
            throw error;
        }
    }

    async getServerStatus() {
        const players = await this.getPlayerList();
        const memory = await this.getMemoryUsage();
        const uptime = await this.getUptime();

        return {
            players: players.length,
            memory,
            uptime
        };
    }

    async executeConsoleCommand(command) {
        return await rcon.sendCommand(command);
    }

    async getMemoryUsage() {
        const stats = await rcon.sendCommand('stats');
        return stats.match(/Memory: (\d+)/)?.[1] || 'N/A';
    }

    async getUptime() {
        const uptime = await rcon.sendCommand('uptime');
        return uptime.match(/Uptime: (.+)/)?.[1] || 'N/A';
    }

    async getPlayerList() {
        const response = await rcon.sendCommand('players');
        return response.split('\n')
            .filter(line => line.includes('steam'))
            .map(line => line.match(/(.+?)\s*\(steam/)?.[1].trim())
            .filter(Boolean);
    }

    async kickPlayer(username) {
        return await rcon.sendCommand(`kick ${username}`);
    }

    async banPlayer(username, reason) {
        return await rcon.sendCommand(`ban ${username} "${reason}"`);
    }

    async whitelistAdd(username) {
        return await rcon.sendCommand(`whitelist add ${username}`);
    }

    async whitelistRemove(username) {
        return await rcon.sendCommand(`whitelist remove ${username}`);
    }

    async mutePlayer(username, duration) {
        return await rcon.sendCommand(`mute ${username} ${duration}`);
    }

    async unmutePlayer(username) {
        return await rcon.sendCommand(`unmute ${username}`);
    }

    async teleportPlayer(username, x, y, z) {
        return await rcon.sendCommand(`teleport ${username} ${x} ${y} ${z}`);
    }

    async giveItem(username, itemId, count = 1) {
        return await rcon.sendCommand(`additem ${username} ${itemId} ${count}`);
    }

    async getPlayerInfo(username) {
        const response = await rcon.sendCommand(`players ${username}`);
        const info = response.match(/(.+?)\s*\(steam id: (.+?)\)/);
        return info ? {
            username: info[1].trim(),
            steamId: info[2],
            isOnline: true,
            location: await this.getPlayerLocation(username)
        } : null;
    }

    async getPlayerLocation(username) {
        const response = await rcon.sendCommand(`coords ${username}`);
        const coords = response.match(/x=(\d+)\s+y=(\d+)\s+z=(\d+)/);
        return coords ? {
            x: parseInt(coords[1]),
            y: parseInt(coords[2]),
            z: parseInt(coords[3])
        } : null;
    }

    async saveWorld() {
        await this.broadcastMessage('Saving world...');
        await rcon.sendCommand('save');
        return true;
    }

    async getServerConfig() {
        const response = await rcon.sendCommand('showoptions');
        return this.parseServerConfig(response);
    }

    async updateServerConfig(option, value) {
        await rcon.sendCommand(`serveroption ${option} ${value}`);
        logger.info(`Server config updated: ${option} = ${value}`);
        return true;
    }

    async manageSafehouse(action, username, x, y, z) {
        const commands = {
            add: `addsafehouse ${username} ${x} ${y} ${z}`,
            remove: `removesafehouse ${username}`,
            list: `listsafehouses`
        };
        return await rcon.sendCommand(commands[action]);
    }

    async executeAdminCommand(command, params = []) {
        const cmd = `admin ${command} ${params.join(' ')}`;
        logger.info(`Executing admin command: ${cmd}`);
        return await rcon.sendCommand(cmd);
    }

    async getServerMetrics() {
        try {
            const metrics = {
                memory: await this.getMemoryUsage(),
                players: (await this.getPlayerList()).length,
                uptime: await this.getUptime(),
                tps: await this.getServerTPS(),
                lastBackup: await this.getLastBackupTime(),
                worldSize: await this.getWorldSize()
            };
            logger.info('Server metrics collected', metrics);
            return metrics;
        } catch (error) {
            logger.error('Failed to collect server metrics:', error);
            throw error;
        }
    }

    async getServerTPS() {
        const response = await rcon.sendCommand('checkTPS');
        return parseFloat(response.match(/TPS: (\d+\.\d+)/)?.[1] || '0');
    }

    async getWorldSize() {
        const response = await rcon.sendCommand('worldsize');
        return {
            chunks: parseInt(response.match(/Chunks: (\d+)/)?.[1] || '0'),
            players: parseInt(response.match(/Players: (\d+)/)?.[1] || '0'),
            zombies: parseInt(response.match(/Zombies: (\d+)/)?.[1] || '0'),
            vehicles: parseInt(response.match(/Vehicles: (\d+)/)?.[1] || '0')
        };
    }

    async monitorServerLoad() {
        const load = await this.getServerMetrics();
        if (load.tps < 15) {
            await this.broadcastMessage('Warning: Server experiencing high load');
            logger.warn('Server load critical:', load);
        }
        return load;
    }

    async getPlayerData(username) {
        const data = await rcon.sendCommand(`playerdata ${username}`);
        return {
            inventory: this.parseInventory(data),
            stats: this.parsePlayerStats(data),
            location: await this.getPlayerLocation(username)
        };
    }

    parseInventory(data) {
        const inventory = data.match(/Inventory:\s*\n([\s\S]+?)\n\n/)?.[1] || '';
        return inventory.split('\n')
            .map(item => item.trim())
            .filter(Boolean)
            .map(item => {
                const [name, count] = item.split('x').map(s => s.trim());
                return { name, count: parseInt(count) || 1 };
            });
    }

    parsePlayerStats(data) {
        const stats = {};
        const statsMatch = data.match(/Stats:\s*\n([\s\S]+?)\n\n/)?.[1] || '';
        statsMatch.split('\n').forEach(line => {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key && value) stats[key] = value;
        });
        return stats;
    }

    parseServerConfig(configData) {
        const config = {};
        const lines = configData.split('\n');
        lines.forEach(line => {
            const [key, value] = line.split('=').map(s => s.trim());
            if (key && value) config[key] = value;
        });
        return config;
    }

    async manageBackups() {
        const backupList = await fs.readdir(this.backupDir);
        const oldBackups = backupList
            .filter(backup => {
                const backupDate = new Date(backup.replace(/-/g, ':'));
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return backupDate < thirtyDaysAgo;
            });

        for (const backup of oldBackups) {
            await fs.remove(path.join(this.backupDir, backup));
            logger.info(`Removed old backup: ${backup}`);
        }
    }

    async getPlayerStats(username) {
        const response = await rcon.sendCommand(`stats ${username}`);
        return {
            kills: parseInt(response.match(/Kills: (\d+)/)?.[1] || '0'),
            deaths: parseInt(response.match(/Deaths: (\d+)/)?.[1] || '0'),
            playtime: parseInt(response.match(/Playtime: (\d+)/)?.[1] || '0'),
            zombiesKilled: parseInt(response.match(/ZombiesKilled: (\d+)/)?.[1] || '0')
        };
    }

    async monitorPerformance() {
        try {
            const tps = await this.getServerTPS();
            const memory = await this.getMemoryUsage();
            
            if (tps < 15 || parseInt(memory) > 90) {
                await this.broadcastMessage('⚠️ Server performance warning');
                logger.warn('Performance alert:', { tps, memory });
            }
            
            return { tps, memory };
        } catch (error) {
            logger.error('Performance monitoring failed:', error);
            throw error;
        }
    }

    async checkMods() {
        const response = await rcon.sendCommand('checkModules');
        return response.split('\n')
            .filter(line => line.includes('Mod:'))
            .map(line => {
                const [name, status] = line.split(':')[1].split('-').map(s => s.trim());
                return { name, status };
            });
    }

    async manageEconomy(action, username, amount) {
        const commands = {
            add: `addpoints ${username} ${amount}`,
            remove: `removepoints ${username} ${amount}`,
            check: `checkpoints ${username}`
        };
        return await rcon.sendCommand(commands[action]);
    }

    async notifyAdmins(message) {
        const admins = await this.getPlayerList()
            .then(players => players.filter(p => p.isAdmin));
        
        for (const admin of admins) {
            await rcon.sendCommand(`servermsg "${admin.username}" "${message}"`);
        }
        logger.info(`Admin notification sent: ${message}`);
    }

    async manageWorld(action, params = {}) {
        const actions = {
            clean: async () => {
                await this.broadcastMessage('Cleaning world...');
                await rcon.sendCommand('cleanworld');
                return 'World cleaned';
            },
            reset: async () => {
                await this.broadcastMessage('Resetting world...');
                await rcon.sendCommand('resetworld');
                return 'World reset';
            },
            save: async () => {
                await this.broadcastMessage('Saving world...');
                await rcon.sendCommand('save');
                return 'World saved';
            },
            setTime: async () => {
                const { hours = 12 } = params;
                await rcon.sendCommand(`settime ${hours}`);
                return `Time set to ${hours}:00`;
            }
        };
        return await actions[action]();
    }

    async manageMods(action, modId) {
        const actions = {
            list: () => rcon.sendCommand('mods'),
            enable: (id) => rcon.sendCommand(`enablemod ${id}`),
            disable: (id) => rcon.sendCommand(`disablemod ${id}`),
            reload: () => rcon.sendCommand('reloadmods')
        };
        return await actions[action](modId);
    }

    async manageEconomy(action, data) {
        const actions = {
            addPoints: ({ username, amount }) => 
                rcon.sendCommand(`addpoints ${username} ${amount}`),
            removePoints: ({ username, amount }) => 
                rcon.sendCommand(`removepoints ${username} ${amount}`),
            getBalance: ({ username }) => 
                rcon.sendCommand(`checkpoints ${username}`),
            leaderboard: () => 
                rcon.sendCommand('pointsleaderboard')
        };
        return await actions[action](data);
    }

    async getAnalytics() {
        return {
            performance: await this.getServerMetrics(),
            players: await this.getActivePlayerStats(),
            world: await this.getWorldStats(),
            economy: await this.getEconomyStats()
        };
    }

    async getActivePlayerStats() {
        const players = await this.getPlayerList();
        const stats = await Promise.all(
            players.map(async player => ({
                ...await this.getPlayerData(player),
                economy: await this.manageEconomy('getBalance', { username: player })
            }))
        );
        return stats;
    }

    async getWorldStats() {
        const size = await this.getWorldSize();
        return {
            ...size,
            time: await rcon.sendCommand('time'),
            weather: await rcon.sendCommand('weather'),
            mods: await this.manageMods('list')
        };
    }

    async getEconomyStats() {
        const leaderboard = await this.manageEconomy('leaderboard');
        return {
            topPlayers: this.parseLeaderboard(leaderboard),
            totalPoints: this.calculateTotalPoints(leaderboard)
        };
    }

    parseLeaderboard(data) {
        return data.split('\n')
            .filter(line => line.includes('points'))
            .map(line => {
                const [username, points] = line.split('-').map(s => s.trim());
                return {
                    username,
                    points: parseInt(points.replace('points', '')) || 0
                };
            });
    }

    calculateTotalPoints(leaderboard) {
        return this.parseLeaderboard(leaderboard)
            .reduce((total, player) => total + player.points, 0);
    }
}

module.exports = new ServerManager();