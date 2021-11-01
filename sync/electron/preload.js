import { ipcRenderer, contextBridge } from 'electron';
import fs from 'fs';
import path from 'path';

export const api = {
  getConfig: async () => {
    ipcRenderer.send('getConfig');
  },
  setConfig: (config) => {
    ipcRenderer.send('setConfig', config);
  },
  on: (channel, callback) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  }
};

contextBridge.exposeInMainWorld('Main', api);
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
