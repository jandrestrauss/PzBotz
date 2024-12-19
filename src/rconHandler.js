const Rcon = require('rcon');
const config = require('../config.json');

class RconHandler {
    constructor() {
        this.rcon = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.rcon = new Rcon(
                config.rcon.host,
                config.rcon.port,
                config.rcon.password
            );

            await this.rcon.connect();
            this.isConnected = true;
            console.log('RCON connected');
            return true;
        } catch (error) {
            console.error('RCON connection failed:', error);
            this.isConnected = false;
            return false;
        }
    }

    async sendCommand(command) {
        if (!this.isConnected) {
            await this.connect();
        }
        return this.rcon.send(command);
    }
}