// eslint-disable-next-line import/no-unresolved
import { Config, IPCChannels, Status } from "./types";
import { contextBridge, ipcRenderer } from "electron";

export const IPCMethods = {
  connectFPOS(): Promise<Status> {
    return ipcRenderer.invoke(IPCChannels.CONNECT_FPOS);
  },
  connectLog(): Promise<Status> {
    return ipcRenderer.invoke(IPCChannels.CONNECT_LOG);
  },
  getConfig(): Promise<Config> {
    return ipcRenderer.invoke(IPCChannels.GET_CONFIG);
  },
  setConfig(data: Config): Promise<Config> {
    return ipcRenderer.invoke(IPCChannels.SET_CONFIG, data);
  },
};

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: IPCMethods,
});
