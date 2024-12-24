require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('./app');
const logger = require('./utils/logger');

// Ensure required directories exist
['logs', 'backups', 'config'].forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Read bot token
const tokenPath = path.join(__dirname, '../bot_token.txt');
if (!fs.existsSync(tokenPath)) {
    logger.error('bot_token.txt not found');
    process.exit(1);
}

process.env.DISCORD_TOKEN = fs.readFileSync(tokenPath, 'utf8').trim();

// Start application
app.start();

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
