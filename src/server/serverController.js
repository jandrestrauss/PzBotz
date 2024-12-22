const EventEmitter = require('events');
const { exec } = require('child_process');
const logger = require('../logging/logger');

class ServerController extends EventEmitter {
    constructor() {
        super();
        this.status = 'stopped';
        this.metrics = new Map();
        this.startMonitoring();
    }

    async executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    logger.logEvent(`Command error: ${error.message}`);
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        });
    }

    startMonitoring() {
        setInterval(() => this.checkHealth(), 30000);
    }
}

module.exports = new ServerController();
