const logger = require('../utils/logger');
const NotificationHandler = require('../utils/notifications');

class EventHandler {
    constructor(client, rcon) {
        this.client = client;
        this.rcon = rcon;
        this.notifications = new NotificationHandler(client);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.rcon.on('playerJoin', this.handlePlayerJoin.bind(this));
        this.rcon.on('playerLeave', this.handlePlayerLeave.bind(this));
        this.rcon.on('playerDeath', this.handlePlayerDeath.bind(this));
        this.rcon.on('serverStart', this.handleServerStart.bind(this));
        this.rcon.on('serverStop', this.handleServerStop.bind(this));
        this.rcon.on('modUpdate', this.handleModUpdate.bind(this));
    }

    async handlePlayerJoin(player) {
        logger.info(`Player joined: ${player.name}`);
        await this.notifications.send(this.client.config.logChannelId, 
            `🟢 **${player.name}** has joined the server`, 'success');
    }

    async handlePlayerLeave(player) {
        logger.info(`Player left: ${player.name}`);
        await this.notifications.send(this.client.config.logChannelId,
            `🔴 **${player.name}** has left the server`, 'info');
    }

    async handlePlayerDeath(data) {
        logger.info(`Player death: ${data.player} - ${data.cause}`);
        await this.notifications.send(this.client.config.deathLogChannelId,
            `💀 **${data.player}** ${data.cause}`, 'error');
    }

    async handleServerStart() {
        logger.info('Server started');
        await this.notifications.sendServerStatus({ 
            online: true,
            players: 0,
            maxPlayers: this.client.config.maxPlayers 
        });
    }

    async handleServerStop() {
        logger.info('Server stopped');
        await this.notifications.sendServerStatus({ 
            online: false,
            players: 0,
            maxPlayers: this.client.config.maxPlayers 
        });
    }

    async handleModUpdate(mod) {
        logger.info(`Mod update detected: ${mod.name}`);
        await this.notifications.sendAdminAlert(
            `Mod update detected for: ${mod.name}\nVersion: ${mod.version}`,
            'warning'
        );
    }
}

module.exports = EventHandler;
