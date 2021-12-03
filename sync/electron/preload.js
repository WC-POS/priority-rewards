import dotenv from 'dotenv';
import { ipcRenderer, contextBridge } from 'electron';

export const api = {
  getConfig: async () => {
    ipcRenderer.send('getConfig');
  },
  setConfig: (config) => {
    ipcRenderer.send('setConfig', config);
  },
  on: (channel, callback) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
  once: (channel, callback) => {
    ipcRenderer.once(channel, (_, data) => callback(data));
  }
};

const env = Object.keys(process.env).reduce(
  (acc, key) => {
    if (key.includes('ELECTRON_PUBLIC')) {
      acc[key] = process.env[key];
    }
    return acc;
  },
  {
    DEFAULT_API_HOST: 'api.priorityrewards.com'
  }
);

contextBridge.exposeInMainWorld('Main', api);
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
contextBridge.exposeInMainWorld('env', env);
