const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    clearConfigSave() {
      ipcRenderer.removeAllListeners('save-config');
    },
    clearConnect() {
      ipcRenderer.removeAllListeners('connect');
    },
    clearError() {
      ipcRenderer.removeAllListeners('error');
    },
    getConfig() {
      return ipcRenderer.invoke('get-config');
    },
    setConfig(config) {
      return ipcRenderer.invoke('set-config', config);
    },
    onConnect(callback) {
      ipcRenderer.on('connect', (event, status) => callback(status));
    },
    onConfigSave(callback) {
      ipcRenderer.on('save-config', (event, config) => callback(config));
    },
    onError(callback) {
      ipcRenderer.on('error', (event, error) => callback(error));
    },
  },
});
