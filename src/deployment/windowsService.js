const { Service } = require('node-windows');
const path = require('path');
const logger = require('../utils/logger');

class WindowsServiceManager {
    constructor() {
        this.service = new Service({
            name: 'PZBotV',
            description: 'Project Zomboid Discord Bot Service',
            script: path.join(process.cwd(), 'src', 'index.js'),
            nodeOptions: ['--harmony'],
            env: [{
                name: "NODE_ENV",
                value: "production"
            }]
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.service.on('install', () => {
            logger.info('Service installed successfully');
            this.service.start();
        });

        this.service.on('error', (error) => {
            logger.error('Service error:', error);
        });
    }

    async install() {
        return new Promise((resolve, reject) => {
            this.service.install();
            this.service.once('install', resolve);
            this.service.once('error', reject);
        });
    }

    async uninstall() {
        return new Promise((resolve, reject) => {
            this.service.uninstall();
            this.service.once('uninstall', resolve);
            this.service.once('error', reject);
        });
    }
}

module.exports = new WindowsServiceManager();
