require('dotenv').config();
const { Client, Intents } = require('discord.js');
const database = require('./database');
const config = require('./config');
const logger = require('./utils/logger');
const commandHandler = require('./commands/handler');
const DiscordEventHandler = require('./events/discordEvents');
const TaskManager = require('./scheduler/taskManager');
const WindowsServiceManager = require('./deployment/windowsService');
const ServerHealth = require('./utils/serverHealth');

class PZBot {
    constructor() {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS
            ]
        });
        this.initialize();
    }

    async initialize() {
        try {
            await database.completeMigrationSystem();
            await config.loadConfig();
            
            this.client.login(process.env.DISCORD_TOKEN);
            
            new DiscordEventHandler(this.client);
            new TaskManager().initialize();
            
            process.on('SIGTERM', () => this.shutdown());
            process.on('SIGINT', () => this.shutdown());
            
            logger.info('PZBot initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize PZBot:', error);
            process.exit(1);
        }
    }

    async shutdown() {
        logger.info('Shutting down PZBot...');
        await this.client.destroy();
        process.exit(0);
    }
}

new PZBot();

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
