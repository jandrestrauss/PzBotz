const fs = require('fs');
const path = require('path');
const readline = require('readline');
const logger = require('../utils/logger');
const EventEmitter = require('events');

class LogAnalyzer extends EventEmitter {
    constructor() {
        super();
        this.patterns = {
            error: /error|exception|failed/i,
            warning: /warning|warn/i,
            crash: /crash|fatal|terminated/i,
            playerAction: /player.*(connected|disconnected|died)/i
        };
        this.serverLogPath = path.join(process.cwd(), 'Zomboid', 'server-console.txt');
    }

    async analyze() {
        try {
            const stats = {
                errors: 0,
                warnings: 0,
                crashes: 0,
                playerActions: []
            };

            const fileStream = fs.createReadStream(this.serverLogPath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            for await (const line of rl) {
                this.analyzeLine(line, stats);
            }

            this.emit('analysisComplete', stats);
            return stats;
        } catch (error) {
            logger.error('Log analysis failed:', error);
            throw error;
        }
    }

    analyzeLine(line, stats) {
        if (this.patterns.error.test(line)) {
            stats.errors++;
            this.emit('error', line);
        }
        if (this.patterns.warning.test(line)) {
            stats.warnings++;
            this.emit('warning', line);
        }
        if (this.patterns.crash.test(line)) {
            stats.crashes++;
            this.emit('crash', line);
        }
        if (this.patterns.playerAction.test(line)) {
            stats.playerActions.push({
                timestamp: new Date(),
                action: line
            });
            this.emit('playerAction', line);
        }
    }
}

module.exports = new LogAnalyzer();
