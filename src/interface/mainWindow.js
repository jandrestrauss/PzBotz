const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ZomboidManager = require('../zomboid/serverManager');
const DiscordBot = require('../discord/bot');

class MainWindow {
    constructor() {
        this.window = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        this.setupHandlers();
        this.loadInterface();
    }

    setupHandlers() {
        ipcMain.on('start-server', async (event) => {
            try {
                await ZomboidManager.startServer();
                event.reply('server-status', { status: 'running' });
            } catch (error) {
                event.reply('error', error.message);
            }
        });

        ipcMain.on('start-bot', async (event) => {
            try {
                await DiscordBot.start();
                event.reply('bot-status', { status: 'connected' });
            } catch (error) {
                event.reply('error', error.message);
            }
        });
    }

    loadInterface() {
        this.window.loadFile(path.join(__dirname, '../ui/index.html'));
    }
}

module.exports = MainWindow;
