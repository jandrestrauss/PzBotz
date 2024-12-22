const Rcon = require('rcon');
const gameEvents = require('../events/eventEmitter');

class GameServer {
    constructor() {
        this.rcon = new Rcon({
            host: process.env.GAME_SERVER_IP,
            port: process.env.RCON_PORT,
            password: process.env.RCON_PASSWORD
        });

        this.rcon.on('authenticated', () => {
            console.log('RCON authenticated');
            this.startMonitoring();
        });

        this.rcon.on('error', (error) => {
            console.error('RCON error:', error);
            gameEvents.emit('serverError', { error: error.message });
        });
    }

    async connect() {
        await this.rcon.connect();
    }

    startMonitoring() {
        setInterval(() => this.updateServerStats(), 30000);
    }

    async updateServerStats() {
        const players = await this.getPlayers();
        const stats = await this.getServerStats();
        gameEvents.emit('statsUpdate', { players, stats });
    }
}

module.exports = new GameServer();
