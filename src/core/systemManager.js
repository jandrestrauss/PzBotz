const EventEmitter = require('events');
const logger = require('../logging/logger');

class SystemManager extends EventEmitter {
    constructor() {
        super();
        this.systems = new Map();
        this.status = 'initializing';
        this.setupCoreServices();
    }

    setupCoreServices() {
        this.registerSystem('database', require('../database/optimizedQueries'));
        this.registerSystem('monitoring', require('../monitoring/systemMonitor'));
        this.registerSystem('security', require('../security/enhancedAuth'));
        this.monitorHealth();
    }

    monitorHealth() {
        setInterval(() => {
            this.systems.forEach((system, name) => {
                if (system.healthCheck) {
                    system.healthCheck().catch(error => {
                        logger.logEvent(`Health check failed for ${name}: ${error.message}`);
                    });
                }
            });
        }, 30000);
    }
}

module.exports = new SystemManager();
