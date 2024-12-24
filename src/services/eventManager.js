const EventEmitter = require('events');
const logger = require('../utils/logger');
const alertSystem = require('./alertSystem');

class EventManager extends EventEmitter {
    constructor() {
        super();
        this.subscribers = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 100;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Server events
        this.on('serverStart', this.handleServerStart.bind(this));
        this.on('serverStop', this.handleServerStop.bind(this));
        this.on('serverCrash', this.handleServerCrash.bind(this));
        
        // Player events
        this.on('playerJoin', this.handlePlayerJoin.bind(this));
        this.on('playerLeave', this.handlePlayerLeave.bind(this));
        this.on('playerDeath', this.handlePlayerDeath.bind(this));
        
        // System events
        this.on('performanceWarning', this.handlePerformanceWarning.bind(this));
        this.on('backupComplete', this.handleBackupComplete.bind(this));
        this.on('error', this.handleError.bind(this));
    }

    async handleEvent(eventType, data) {
        this.logEvent(eventType, data);
        this.emit(eventType, data);
        await this.notifySubscribers(eventType, data);
    }

    logEvent(eventType, data) {
        const event = {
            type: eventType,
            data,
            timestamp: new Date()
        };

        this.eventHistory.unshift(event);
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.pop();
        }

        logger.logEvent(`Event: ${eventType}`);
    }

    async notifySubscribers(eventType, data) {
        const subscribers = this.subscribers.get(eventType) || [];
        for (const callback of subscribers) {
            try {
                await callback(data);
            } catch (error) {
                logger.error(`Error in event subscriber: ${eventType}`, error);
            }
        }
    }

    subscribe(eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, new Set());
        }
        this.subscribers.get(eventType).add(callback);
    }

    unsubscribe(eventType, callback) {
        const subscribers = this.subscribers.get(eventType);
        if (subscribers) {
            subscribers.delete(callback);
        }
    }

    getEventHistory(eventType = null) {
        if (eventType) {
            return this.eventHistory.filter(event => event.type === eventType);
        }
        return this.eventHistory;
    }
}

module.exports = new EventManager();
