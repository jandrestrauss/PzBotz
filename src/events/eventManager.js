const EventEmitter = require('events');
const { MetricsCollector } = require('../metrics/collector');

class EventManager extends EventEmitter {
    constructor() {
        super();
        this.handlers = new Map();
        this.setupBaseHandlers();
    }

    setupBaseHandlers() {
        this.on('serverStart', this.handleServerStart.bind(this));
        this.on('serverStop', this.handleServerStop.bind(this));
        this.on('playerJoin', this.handlePlayerJoin.bind(this));
        this.on('playerLeave', this.handlePlayerLeave.bind(this));
        this.on('error', this.handleError.bind(this));
    }

    handleError(error) {
        console.error('Event system error:', error);
        MetricsCollector.recordError(error);
    }

    registerHandler(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event).add(handler);
    }
}

module.exports = new EventManager();
