const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const wsManager = require('../websocket/wsManager');

class ZomboidServerManager {
    constructor() {
        this.process = null;
        this.config = {
            serverPath: process.env.ZOMBOID_SERVER_PATH,
            serverMemory: process.env.SERVER_MEMORY || '4G',
            adminPassword: process.env.ADMIN_PASSWORD,
            serverName: process.env.SERVER_NAME || 'PZServer'
        };
    }

    async start() {
        if (this.process) {
            throw new Error('Server is already running');
        }

        const startScript = path.join(this.config.serverPath, 'StartServer64.bat');
        this.process = spawn(startScript, [
            '-servername', this.config.serverName,
            '-adminpassword', this.config.adminPassword,
            '-memory', this.config.serverMemory
        ]);

        this.setupProcessHandlers();
        logger.logEvent('Server starting...');
        wsManager.broadcast('server-status', { status: 'starting' });
    }

    setupProcessHandlers() {
        this.process.stdout.on('data', (data) => {
            logger.logEvent(`Server: ${data}`);
            wsManager.broadcast('server-log', { message: data.toString() });
        });

        this.process.on('close', (code) => {
            logger.logEvent(`Server closed with code ${code}`);
            this.process = null;
            wsManager.broadcast('server-status', { status: 'stopped' });
        });
    }

    async updateServerConfig(options) {
        // Update server configuration file (servertest.ini)
        const configData = await fs.readFile(this.config.configPath, 'utf8');
        // Modify only what's needed, leave Project Zomboid defaults
        // ...
    }

    async executeRconCommand(command) {
        // Use Project Zomboid's built-in RCON
        // ...
    }
}

module.exports = new ZomboidServerManager();
