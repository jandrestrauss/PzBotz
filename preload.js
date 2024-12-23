const { contextBridge, ipcRenderer } = require('electron');

const validateData = (data) => {
  // Add your validation logic here
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }
  return true;
};

contextBridge.exposeInMainWorld('api', {
  doSomething: async (data) => {
    try {
      return await ipcRenderer.invoke('doSomething', data);
    } catch (error) {
      console.error('Error in doSomething:', error);
      throw error;
    }
  },
  saveData: async (data) => {
    try {
      validateData(data);
      return await ipcRenderer.invoke('saveData', data);
    } catch (error) {
      console.error('Error in saveData:', error);
      throw error;
    }
  },
  loadData: async () => {
    try {
      return await ipcRenderer.invoke('loadData');
    } catch (error) {
      console.error('Error in loadData:', error);
      throw error;
    }
  }
});
