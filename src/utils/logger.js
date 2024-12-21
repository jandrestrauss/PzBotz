const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

class Logger {
    constructor(options = {}) {
        this.logDir = options.logDir || 'logs';
        this.maxLogAge = options.maxLogAge || 7; // days
        this.initialize();
    }

    async initialize() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
            this.cleanOldLogs();
        } catch (error) {
            console.error('Error initializing logger:', error);
        }
    }

    async log(level, message, data = {}) {
        const timestamp = new Date();
        const logEntry = {
            timestamp: timestamp.toISOString(),
            level,
            message,
            ...data
        };

        const logFile = path.join(this.logDir, `${format(timestamp, 'yyyy-MM-dd')}.log`);
        const logLine = JSON.stringify(logEntry) + '\n';

        try {
            await fs.appendFile(logFile, logLine);
            if (level === 'error') {
                console.error(`[${level.toUpperCase()}] ${message}`);
            } else {
                console.log(`[${level.toUpperCase()}] ${message}`);
            }
        } catch (error) {
            console.error('Error writing to log file:', error);
        }
    }

    async cleanOldLogs() {
        try {
            const files = await fs.readdir(this.logDir);
            const now = Date.now();

            for (const file of files) {
                const filePath = path.join(this.logDir, file);
                const stats = await fs.stat(filePath);
                const age = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24); // age in days

                if (age > this.maxLogAge) {
                    await fs.unlink(filePath);
                    console.log(`Deleted old log file: ${file}`);
                }
            }
        } catch (error) {
            console.error('Error cleaning old logs:', error);
        }
    }

    info(message, data) {
        return this.log('info', message, data);
    }

    warn(message, data) {
        return this.log('warn', message, data);
    }

    error(message, data) {
        return this.log('error', message, data);
    }

    debug(message, data) {
        if (process.env.NODE_ENV === 'development') {
            return this.log('debug', message, data);
        }
    }
}

module.exports = new Logger();
