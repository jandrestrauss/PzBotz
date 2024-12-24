const EventEmitter = require('events');
const os = require('os');
const { exec } = require('child_process');
const logger = require('../utils/logger');

class HealthMonitor extends EventEmitter {
    constructor() {
        super();
        this.healthChecks = new Map();
        this.status = {
            serverRunning: false,
            rconConnected: false,
            diskSpace: 0,
            lastCheck: null
        };
        this.setupHealthChecks();
    }

    setupHealthChecks() {
        this.addHealthCheck('server', async () => {
            const isRunning = await this.checkServerProcess();
            if (!isRunning && this.status.serverRunning) {
                this.emit('serverDown');
            }
            this.status.serverRunning = isRunning;
        });

        this.addHealthCheck('disk', async () => {
            const space = await this.checkDiskSpace();
            if (space > 90) {
                this.emit('lowDiskSpace', space);
            }
            this.status.diskSpace = space;
        });
    }

    addHealthCheck(name, check) {
        this.healthChecks.set(name, check);
    }

    async runHealthChecks() {
        for (const [name, check] of this.healthChecks) {
            try {
                await check();
                logger.logEvent(`Health check passed: ${name}`);
            } catch (error) {
                logger.error(`Health check failed: ${name}`, error);
                this.emit('healthCheckFailed', { name, error });
            }
        }
        this.status.lastCheck = new Date();
    }

    async checkServerProcess() {
        return new Promise((resolve) => {
            exec('tasklist /FI "IMAGENAME eq java.exe"', (error, stdout) => {
                resolve(!error && stdout.toLowerCase().includes('java.exe'));
            });
        });
    }

    async checkDiskSpace() {
        // Windows-specific disk space check
        return new Promise((resolve) => {
            exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
                if (error) {
                    resolve(0);
                    return;
                }
                // Parse and calculate disk space usage
                const lines = stdout.split('\n');
                // ... disk space calculation logic ...
                resolve(75); // Example value
            });
        });
    }

    getStatus() {
        return this.status;
    }
}

module.exports = new HealthMonitor();
