const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const analyticsService = require('../analytics/analyticsService');
const gameEvents = require('../events/eventEmitter');
const EventEmitter = require('events');
const Rcon = require('rcon-client').Rcon;

class ServerManager extends EventEmitter {
    constructor() {
        super();
        this.rcon = null;
        this.serverState = {
            status: 'offline',
            players: new Set(),
            resources: {}
        };
        this.status = 'stopped';
        this.lastBackup = null;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        gameEvents.on('serverError', (error) => {
            analyticsService.trackEvent('serverError', error);
            this.handleError(error);
        });
    }

    async connect() {
        try {
            this.rcon = new Rcon({
                host: process.env.SERVER_IP,
                port: process.env.RCON_PORT,
                password: process.env.RCON_PASSWORD
            });

            await this.rcon.connect();
            this.serverState.status = 'online';
            this.startMonitoring();
        } catch (error) {
            this.emit('error', error);
        }
    }

    async executeCommand(command) {
        if (!this.rcon?.connected) {
            throw new Error('RCON not connected');
        }
        return await this.rcon.send(command);
    }

    async handleError(error) {
        if (error.code === 'CRASH') {
            await this.restart();
        }
    }
}

module.exports = new ServerManager();
