const fs = require('fs');
const path = require('path');
const readline = require('readline');
const logger = require('../utils/logger');
const EventEmitter = require('events');

class LogAnalyzer extends EventEmitter {
    constructor() {
        super();
        this.logPatterns = {
            error: /\b(error|exception|failed|crash)\b/i,
            warning: /\b(warning|warn)\b/i,
            playerAction: /Player '([^']+)' (connected|disconnected|died)/,
            serverEvent: /\b(started|stopped|saved|backup)\b/i
        };
        this.stats = {
            errors: 0,
            warnings: 0,
            playerEvents: 0,
            serverEvents: 0
        };
    }

    async analyzeLogs(days = 1) {
        const logDir = path.join(process.cwd(), 'Zomboid', 'Logs');
        const currentDate = new Date();
        const files = await this.getRecentLogFiles(logDir, days);

        this.resetStats();
        for (const file of files) {
            await this.analyzeFile(file);
        }

        return {
            stats: this.stats,
            timestamp: currentDate,
            analyzedFiles: files.length
        };
    }

    async getRecentLogFiles(dir, days) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const files = await fs.promises.readdir(dir);
        return files
            .map(file => ({
                name: file,
                path: path.join(dir, file),
                mtime: fs.statSync(path.join(dir, file)).mtime
            }))
            .filter(file => file.mtime > cutoff)
            .map(file => file.path);
    }

    async analyzeFile(filePath) {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            this.analyzeLine(line);
        }
    }

    analyzeLine(line) {
        for (const [type, pattern] of Object.entries(this.logPatterns)) {
            if (pattern.test(line)) {
                this.handleMatch(type, line);
            }
        }
    }

    handleMatch(type, line) {
        switch(type) {
            case 'error':
                this.stats.errors++;
                this.emit('error', { line, timestamp: new Date() });
                break;
            case 'warning':
                this.stats.warnings++;
                this.emit('warning', { line, timestamp: new Date() });
                break;
            case 'playerAction':
                this.stats.playerEvents++;
                this.emit('playerAction', { line, timestamp: new Date() });
                break;
            case 'serverEvent':
                this.stats.serverEvents++;
                this.emit('serverEvent', { line, timestamp: new Date() });
                break;
        }
    }

    resetStats() {
        this.stats = {
            errors: 0,
            warnings: 0,
            playerEvents: 0,
            serverEvents: 0
        };
    }
}

module.exports = new LogAnalyzer();
