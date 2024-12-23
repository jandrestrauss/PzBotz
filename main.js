const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load your content
  win.loadFile('index.html');

  // Add window management
  win.on('closed', () => {
    // Clean up resources
  });

  win.on('ready-to-show', () => {
    win.show();
  });
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Proper app lifecycle handling
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('doSomething', async (event, data) => {
  // Handle the data and return a result
  return 'Result from main process';
});

ipcMain.handle('saveData', async (event, data) => {
  try {
    // Implement data saving logic
    await fs.writeFile('data.json', JSON.stringify(data));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('loadData', async () => {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
