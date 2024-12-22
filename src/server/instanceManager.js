const { EventEmitter } = require('events');
const logger = require('../logging/logger');

class InstanceManager extends EventEmitter {
    constructor() {
        super();
        this.instances = new Map();
        this.maxInstances = parseInt(process.env.MAX_INSTANCES) || 3;
        this.setupMonitoring();
    }

    async createInstance(config) {
        if (this.instances.size >= this.maxInstances) {
            throw new Error('Max instances limit reached');
        }

        const instanceId = Date.now().toString();
        this.instances.set(instanceId, {
            id: instanceId,
            status: 'starting',
            config,
            startTime: Date.now()
        });

        logger.logEvent(`Creating new instance: ${instanceId}`);
        return instanceId;
    }

    setupMonitoring() {
        setInterval(() => this.checkInstances(), 60000);
    }
}

module.exports = new InstanceManager();
