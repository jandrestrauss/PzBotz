const { spawn } = require('child_process');
const path = require('path');
const EventEmitter = require('events');
const logger = require('../utils/logger');
const { PerformanceMonitor } = require('../utils/performance');

class ZomboidServer extends EventEmitter {
    constructor() {
        super();
        this.process = null;
        this.status = 'stopped';
        this.metrics = new PerformanceMonitor();
    }

    async start() {
        if (this.status === 'running') {
            throw new Error('Server is already running');
        }

        const serverPath = path.join(process.env.ZOMBOID_SERVER_PATH, 'StartServer64.bat');
        const args = [
            '-servername', process.env.SERVER_NAME,
            '-adminpassword', process.env.ADMIN_PASSWORD,
            '-ip', process.env.SERVER_IP || '0.0.0.0',
            '-port', process.env.SERVER_PORT || '16261'
        ];

        this.process = spawn(serverPath, args);
        this.setupProcessHandlers();
        this.status = 'running';
        this.emit('status', this.status);
    }

    setupProcessHandlers() {
        this.process.stdout.on('data', (data) => {
            this.handleServerOutput(data.toString());
        });

        this.process.on('close', (code) => {
            this.status = 'stopped';
            this.emit('status', this.status);
            logger.logEvent(`Server process exited with code ${code}`);
        });
    }

    handleServerOutput(data) {
        // Parse and handle Project Zomboid server output
        if (data.includes('Server started')) {
            this.emit('ready');
        } else if (data.includes('Player connected')) {
            const playerInfo = this.parsePlayerInfo(data);
            this.emit('playerJoin', playerInfo);
        }
        this.emit('log', data);
    }

    async restart() {
        if (this.status === 'running') {
            await this.stop();
        }
        await this.start();
    }

    async stop() {
        if (this.process) {
            this.process.kill();
            this.status = 'stopped';
            this.emit('status', this.status);
        }
    }

    getOnlinePlayers() {
        return Array.from(this.activePlayers.values()).map(player => player.username);
    }

    getPlayerCount() {
        return this.activePlayers.size;
    }

    getUptime() {
        if (this.status === 'running') {
            const uptime = process.uptime();
            return `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;
        }
        return 'Server is not running';
    }
}

module.exports = new ZomboidServer();
