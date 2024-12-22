const { Rcon } = require('rcon-client');
const EventEmitter = require('events');
const metrics = require('../metrics/collector');

class GameIntegration extends EventEmitter {
    constructor() {
        super();
        this.connection = null;
        this.commandQueue = [];
        this.reconnectAttempts = 0;
    }

    async initialize() {
        this.connection = new Rcon({
            host: process.env.GAME_SERVER_IP,
            port: parseInt(process.env.GAME_SERVER_PORT),
            password: process.env.RCON_PASSWORD,
            timeout: 5000
        });

        this.connection.on('authenticated', () => {
            this.reconnectAttempts = 0;
            this.processCommandQueue();
        });

        this.connection.on('error', this.handleError.bind(this));
    }

    async sendCommand(command) {
        if (!this.connection?.authenticated) {
            this.commandQueue.push(command);
            await this.initialize();
            return;
        }
        const response = await this.connection.send(command);
        metrics.recordCommand(command, response);
        return response;
    }
}

module.exports = new GameIntegration();
