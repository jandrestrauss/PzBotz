const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { logEvent } = require('../logging/logger');
const { AppError } = require('../utils/errorHandler');

class ServerControl {
    async start() {
        try {
            await execAsync('start-server.bat');
            logEvent('Server started successfully');
            return { status: 'success', message: 'Server started' };
        } catch (error) {
            throw new AppError('Failed to start server', 500);
        }
    }

    async stop() {
        try {
            await execAsync('stop-server.bat');
            logEvent('Server stopped successfully');
            return { status: 'success', message: 'Server stopped' };
        } catch (error) {
            throw new AppError('Failed to stop server', 500);
        }
    }

    async restart() {
        await this.stop();
        await this.start();
        return { status: 'success', message: 'Server restarted' };
    }
}

module.exports = new ServerControl();
