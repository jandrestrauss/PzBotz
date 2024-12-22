const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logFile = path.join(__dirname, '../../logs/app.log');
    }

    logEvent(event) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${event}\n`;
        fs.appendFileSync(this.logFile, logMessage);
        console.log(logMessage);
    }

    error(message, error) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ERROR: ${message}\n${error.stack}\n`;
        fs.appendFileSync(this.logFile, logMessage);
        console.error(logMessage);
    }
}

module.exports = new Logger();
