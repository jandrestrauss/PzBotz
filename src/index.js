require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const serviceIntegrator = require('./core/serviceIntegrator');
const Dashboard = require('./dashboard');
const bot = require('./bot');
const wsServer = require('./services/websocket/wsServer');
const { initializeDatabase } = require('./database/integration');

async function initialize() {
    try {
        // Ensure directories exist
        ['logs', 'backups', 'data', 'config'].forEach(dir => {
            const dirPath = path.join(__dirname, '..', dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        });

        // Initialize database
        await initializeDatabase();

        // Initialize services
        await serviceIntegrator.initializeServices();
        
        // Start dashboard
        const dashboard = new Dashboard();
        await dashboard.start(3000);
        
        // Start WebSocket server
        wsServer.initialize(dashboard.server);
        
        // Start bot
        await bot.start();
        
        logger.info('Application started successfully');
    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

// Handle shutdown
process.on('SIGINT', async () => {
    logger.info('Shutting down...');
    await serviceIntegrator.stop();
    process.exit(0);
});

initialize();

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/dashboard.css';
import './styles/admin.css';
import './styles/statistics.css';
import './styles/settings.css';
import './styles/login.css';
import './styles/logout.css';
import './styles/userManagement.css';
import './styles/logs.css';
import './styles/backup.css';
import './styles/serverControl.css';
import './styles/localization.css';
import './styles/featureEnhancements.css';
import './styles/performanceOptimization.css';
import './styles/documentation.css';
import './styles/alertSystem.css';
import './styles/rateLimiting.css';
import './styles/advancedStatistics.css';

ReactDOM.render(<App />, document.getElementById('root'));
