import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import Navigation from './ui/components/Navigation';
import Dashboard from './ui/components/Dashboard';
import AdminPanel from './ui/components/AdminPanel';
import Profile from './ui/components/Profile';
import Statistics from './ui/components/Statistics';
import Settings from './ui/components/Settings';
import Login from './ui/components/Login';
import Logout from './ui/components/Logout';
import UserManagement from './ui/components/UserManagement';
import Logs from './ui/components/Logs';
import Backup from './ui/components/Backup';
import ServerControl from './ui/components/ServerControl';
import Localization from './ui/components/Localization';
import FeatureEnhancements from './ui/components/FeatureEnhancements';
import PerformanceOptimization from './ui/components/PerformanceOptimization';
import Documentation from './ui/components/Documentation';
import AlertSystem from './ui/components/AlertSystem';
import RateLimiting from './ui/components/RateLimiting';
import AdvancedStatistics from './ui/components/AdvancedStatistics';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <Switch>
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/admin" component={AdminPanel} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/statistics" component={Statistics} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/users" component={UserManagement} />
                    <Route path="/logs" component={Logs} />
                    <Route path="/backup" component={Backup} />
                    <Route path="/server-control" component={ServerControl} />
                    <Route path="/localization" component={Localization} />
                    <Route path="/features" component={FeatureEnhancements} />
                    <Route path="/performance" component={PerformanceOptimization} />
                    <Route path="/documentation" component={Documentation} />
                    <Route path="/alerts" component={AlertSystem} />
                    <Route path="/rate-limiting" component={RateLimiting} />
                    <Route path="/advanced-statistics" component={AdvancedStatistics} />
                    <Route path="/" exact component={Dashboard} />
                </Switch>
            </Router>
        </AuthProvider>
    );
};

export default App;

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const ApplicationManager = require('./core/applicationManager');
const SettingsManager = require('./config/settingsManager');
const BackupManager = require('./backup/backupManager');
const logger = require('./utils/logger');

require('dotenv').config();

class PZBotzApp {
    constructor() {
        this.mainWindow = null;
        this.setupAppEvents();
    }

    setupAppEvents() {
        app.on('ready', async () => {
            await this.initializeApp();
            this.createMainWindow();
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('before-quit', async () => {
            await ApplicationManager.shutdown();
        });
    }

    async initializeApp() {
        try {
            await SettingsManager.loadSettings();
            await ApplicationManager.initialize();
            BackupManager.scheduleBackup();
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            app.quit();
        }
    }

    createMainWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        this.mainWindow.loadURL(
            isDev 
                ? 'http://localhost:3000' 
                : `file://${path.join(__dirname, '../build/index.html')}`
        );

        if (isDev) {
            this.mainWindow.webContents.openDevTools();
        }
    }
}

new PZBotzApp();
