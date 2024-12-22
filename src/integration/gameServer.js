const Rcon = require('rcon-client').Rcon;
const gameEvents = require('../events/eventEmitter');
const analyticsService = require('../analytics/analyticsService');

class GameServerIntegration {
    constructor() {
        this.rcon = null;
        this.status = 'disconnected';
        this.reconnectAttempts = 0;
    }

    async connect() {
        this.rcon = new Rcon({
            host: process.env.GAME_SERVER_IP,
            port: parseInt(process.env.RCON_PORT),
            password: process.env.RCON_PASSWORD
        });

        try {
            await this.rcon.connect();
            this.status = 'connected';
            this.reconnectAttempts = 0;
            this.startMonitoring();
        } catch (error) {
            this.handleConnectionError(error);
        }
    }

    startMonitoring() {
        setInterval(() => this.checkServerStatus(), 30000);
    }
}

module.exports = new GameServerIntegration();
