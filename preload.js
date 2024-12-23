const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Expose specific functions with limited scope
  doSomething: (data) => {
    return ipcRenderer.invoke('doSomething', data);
  }
});
