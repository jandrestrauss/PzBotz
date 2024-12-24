const EventEmitter = require('events');
const logger = require('../utils/logger');

class GlobalEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.eventHistory = [];
        this.maxHistorySize = 100;
        this.setupErrorHandling();
    }

    emit(event, ...args) {
        this.logEvent(event, args);
        return super.emit(event, ...args);
    }

    logEvent(event, args) {
        const eventLog = {
            timestamp: Date.now(),
            event,
            data: args
        };

        this.eventHistory.push(eventLog);
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }

        logger.logEvent(`Event emitted: ${event}`);
    }

    getEventHistory() {
        return this.eventHistory;
    }

    setupErrorHandling() {
        this.on('error', (error) => {
            logger.error('Event system error:', error);
        });
    }
}

module.exports = new GlobalEventEmitter();
