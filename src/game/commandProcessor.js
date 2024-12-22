const { PerformanceMonitor } = require('../utils/performance');
const logger = require('../logging/logger');

class CommandProcessor {
    constructor() {
        this.commands = new Map();
        this.history = [];
        this.setupCommands();
    }

    setupCommands() {
        this.registerCommand('restart', {
            permission: 'ADMIN',
            handler: async () => {
                const stopTimer = PerformanceMonitor.startTimer('serverRestart');
                await this.handleRestart();
                stopTimer();
            }
        });

        this.registerCommand('status', {
            permission: 'USER',
            handler: () => this.getServerStatus()
        });
    }

    async processCommand(command, user) {
        const cmd = this.commands.get(command);
        if (!cmd) throw new Error('Command not found');
        
        const result = await cmd.handler();
        this.history.push({ command, user, timestamp: Date.now() });
        return result;
    }
}

module.exports = new CommandProcessor();
