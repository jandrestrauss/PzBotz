const WebSocket = require('ws');
const logger = require('../utils/logger');

class ServerMonitorSocket {
    constructor(server, bot) {
        this.wss = new WebSocket.Server({ server });
        this.bot = bot;
        this.clients = new Set();
        this.setupHandlers();
        this.startMonitoring();
    }

    setupHandlers() {
        this.wss.on('connection', (ws) => {
            this.clients.add(ws);
            
            ws.on('close', () => {
                this.clients.delete(ws);
            });

            ws.on('error', (error) => {
                logger.error('WebSocket Error:', error);
                this.clients.delete(ws);
            });

            // Send initial server state
            this.sendServerState(ws);
        });
    }

    startMonitoring() {
        setInterval(() => {
            this.broadcastServerState();
        }, 5000); // Update every 5 seconds
    }

    async sendServerState(ws) {
        try {
            const state = await this.getServerState();
            ws.send(JSON.stringify(state));
        } catch (error) {
            logger.error('Error sending server state:', error);
        }
    }

    async broadcastServerState() {
        if (this.clients.size === 0) return;

        try {
            const state = await this.getServerState();
            const payload = JSON.stringify(state);

            this.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            });
        } catch (error) {
            logger.error('Error broadcasting server state:', error);
        }
    }

    async getServerState() {
        const stats = await this.bot.getServerStats();
        const players = await this.bot.getOnlinePlayers();
        
        return {
            type: 'serverState',
            timestamp: Date.now(),
            data: {
                status: this.bot.serverStatus,
                stats,
                players,
                lastBackup: this.bot.lastBackup,
                modUpdates: this.bot.pendingModUpdates
            }
        };
    }
}

module.exports = ServerMonitorSocket;
