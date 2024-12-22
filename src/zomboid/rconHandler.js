const Rcon = require('rcon');
const logger = require('../logging/logger');

class ZomboidRCON {
    constructor() {
        this.connection = null;
        this.commandQueue = [];
        this.setupConnection();
    }

    async setupConnection() {
        this.connection = new Rcon(
            process.env.SERVER_IP,
            process.env.RCON_PORT,
            process.env.RCON_PASSWORD
        );

        this.connection.on('auth', () => {
            logger.logEvent('RCON authenticated');
            this.processQueue();
        });

        this.connection.on('error', (error) => {
            logger.logEvent(`RCON error: ${error.message}`);
            setTimeout(() => this.reconnect(), 5000);
        });
    }

    async executeCommand(command) {
        if (!this.connection.authenticated) {
            this.commandQueue.push(command);
            return;
        }
        return this.connection.send(command);
    }

    async getOnlinePlayers() {
        const response = await this.executeCommand('players');
        return this.parsePlayerList(response);
    }
}

module.exports = new ZomboidRCON();
