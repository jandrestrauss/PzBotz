const gameEvents = require('../events/eventEmitter');

class ServerState {
    constructor() {
        this.state = {
            status: 'offline',
            players: [],
            uptime: 0,
            lastUpdate: null
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        gameEvents.on('playerJoin', (player) => {
            this.state.players.push(player);
            this.state.lastUpdate = Date.now();
        });

        gameEvents.on('playerLeave', (playerId) => {
            this.state.players = this.state.players.filter(p => p.id !== playerId);
            this.state.lastUpdate = Date.now();
        });
    }

    getState() {
        return { ...this.state };
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
        gameEvents.emit('stateUpdate', this.getState());
    }
}

module.exports = new ServerState();
