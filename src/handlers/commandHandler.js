const logger = require('../utils/logger');

class CommandHandler {
    constructor(rconHandler) {
        this.rcon = rconHandler;
        this.commandHistory = new Map();
        this.maxHistorySize = 100;
    }

    async executeCommand(command, context = {}) {
        try {
            logger.info(`Executing command: ${command}`, context);
            const response = await this.rcon.sendCommand(command);
            this.addToHistory(command, response, context);
            return response;
        } catch (error) {
            logger.error(`Command execution failed: ${command}`, error);
            throw error;
        }
    }

    addToHistory(command, response, context) {
        const timestamp = Date.now();
        const entry = {
            timestamp,
            command,
            response,
            context
        };

        // Add to history with timestamp as key
        this.commandHistory.set(timestamp, entry);

        // Maintain history size limit
        if (this.commandHistory.size > this.maxHistorySize) {
            const oldestKey = this.commandHistory.keys().next().value;
            this.commandHistory.delete(oldestKey);
        }
    }

    getHistory(limit = 10) {
        return Array.from(this.commandHistory.values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    clearHistory() {
        this.commandHistory.clear();
        logger.info('Command history cleared');
    }

    async executeServerCommand(command, options = {}) {
        const { timeout = 5000, retries = 3 } = options;
        let attempt = 0;
        let lastError;

        while (attempt < retries) {
            try {
                const responsePromise = this.executeCommand(command);
                const response = await Promise.race([
                    responsePromise,
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Command timed out')), timeout)
                    )
                ]);
                return response;
            } catch (error) {
                lastError = error;
                attempt++;
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }

        throw new Error(`Command failed after ${retries} attempts: ${lastError.message}`);
    }
}

module.exports = CommandHandler;
