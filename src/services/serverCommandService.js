const rconService = require('./rconService');
const logger = require('../utils/logger');
const EventEmitter = require('events');

class ServerCommandService extends EventEmitter {
    constructor() {
        super();
        this.commandQueue = [];
        this.processing = false;
    }

    async executeCommand(command, options = {}) {
        const commandObj = {
            command,
            options,
            timestamp: Date.now()
        };

        if (options.priority) {
            return this.executeImmediately(commandObj);
        }

        return new Promise((resolve, reject) => {
            this.commandQueue.push({
                ...commandObj,
                resolve,
                reject
            });
            this.processQueue();
        });
    }

    async executeImmediately(commandObj) {
        try {
            const result = await rconService.execute(commandObj.command);
            this.emit('commandExecuted', {
                command: commandObj.command,
                result,
                duration: Date.now() - commandObj.timestamp
            });
            return result;
        } catch (error) {
            logger.error(`Command execution failed: ${commandObj.command}`, error);
            throw error;
        }
    }

    async processQueue() {
        if (this.processing || this.commandQueue.length === 0) return;

        this.processing = true;
        while (this.commandQueue.length > 0) {
            const item = this.commandQueue.shift();
            try {
                const result = await this.executeImmediately(item);
                item.resolve(result);
            } catch (error) {
                item.reject(error);
            }
        }
        this.processing = false;
    }

    clearQueue() {
        this.commandQueue = [];
        this.processing = false;
    }
}

module.exports = new ServerCommandService();
