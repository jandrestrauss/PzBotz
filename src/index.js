require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const bot = require('./bot');
const monitorService = require('./services/monitorService');
const backupService = require('./services/backupService');
const gameDataSync = require('./services/gameDataSync');
const errorRecovery = require('./services/errorRecovery');

async function initialize() {
    // Create required directories
    ['logs', 'backups', 'data', 'config'].forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });

    // Validate bot token
    const tokenPath = path.join(__dirname, '../bot_token.txt');
    if (!fs.existsSync(tokenPath)) {
        logger.error('bot_token.txt not found. Please create this file with your bot token.');
        process.exit(1);
    }

    process.env.DISCORD_TOKEN = fs.readFileSync(tokenPath, 'utf8').trim();

    try {
        await bot.start();
        monitorService.start();
        backupService.start();
        gameDataSync.start();
        
        logger.logEvent('Bot initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize bot:', error);
        process.exit(1);
    }
}

// Handle errors
process.on('uncaughtException', error => {
    logger.error('Uncaught exception:', error);
    errorRecovery.handleError('uncaughtException', error);
});

process.on('unhandledRejection', error => {
    logger.error('Unhandled rejection:', error);
    errorRecovery.handleError('unhandledRejection', error);
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
