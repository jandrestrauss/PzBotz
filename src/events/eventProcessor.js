const { PerformanceMonitor } = require('../utils/performance');
const logger = require('../logging/logger');

class EventProcessor {
    constructor() {
        this.handlers = new Map();
        this.eventQueue = [];
        this.processing = false;
        this.registerDefaultHandlers();
    }

    registerDefaultHandlers() {
        this.registerHandler('playerJoin', async (data) => {
            const stopTimer = PerformanceMonitor.startTimer('playerJoinEvent');
            try {
                await require('../players/playerManager')
                    .handlePlayerJoin(data.playerId, data);
            } finally {
                stopTimer();
            }
        });

        this.registerHandler('serverEvent', async (data) => {
            logger.logEvent(`Server event: ${data.type}`);
            // Handle server events
        });
    }

    async processEvent(event) {
        const handler = this.handlers.get(event.type);
        if (handler) {
            try {
                await handler(event.data);
            } catch (error) {
                logger.logEvent(`Event processing error: ${error.message}`);
            }
        }
    }
}

module.exports = new EventProcessor();
