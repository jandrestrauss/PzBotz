const Rcon = require('rcon-client');
require('dotenv').config();

class RconManager {
    constructor() {
        this.rcon = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.rcon = new Rcon({
                host: process.env.PZ_SERVER_HOST,
                port: process.env.PZ_SERVER_RCON_PORT,
                password: process.env.PZ_SERVER_RCON_PASSWORD
            });

            await this.rcon.connect();
            this.isConnected = true;
            console.log('RCON connected');
        } catch (error) {
            console.error('RCON connection failed:', error);
            this.isConnected = false;
        }
    }

    async sendCommand(command) {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const response = await this.rcon.send(command);
            return response;
        } catch (error) {
            console.error('Error sending RCON command:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.rcon.disconnect();
            this.isConnected = false;
            console.log('RCON disconnected');
        }
    }
}

module.exports = new RconManager();