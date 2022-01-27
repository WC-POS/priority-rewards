import { IPCMethods } from "../preload";
export enum SyncTables {}

export enum IPCChannels {
  CONNECT_FPOS = "connect-fpos",
  CONNECT_LOG = "connect-log",
  GET_CONFIG = "config-get",
  GET_LOG = "log-get",
  SET_CONFIG = "config-set",
  ON_CONFIG_SAVE = "on-save-config",
  ON_ERROR = "on-error",
  ON_FPOS_CONNECT = "on-connect-fpos",
  ON_LOG_CONNECT = "on-connect-log",
  SYNC_CUSTOMERS = "sync-customers",
  SYNC_DEPARTMENTS = "sync-departments",
  SYNC_MEDIA = "sync-media",
  SYNC_SALES = "sync-sales",
}

export interface Config {
  app: {
    quickSyncFrequency: number;
    fullSyncTime: string;
  };
  cloud: {
    publicKey: string;
    privateKey: string;
  };
  email: {
    host: string;
    user: string;
    password: string;
    port: number;
    useSSL: boolean;
  };
  fpos: {
    host: string;
    user: string;
    password: string;
    db: string;
  };
}

export interface Status {
  isConnected: boolean;
  name: "FPOS" | "LOG";
}

export type FPOSTableOptions =
  | "CUSTOMER"
  | "DEPARTMENT"
  | "ITEM"
  | "MEDIA"
  | "SALE"
  | "SALE_ITEM"
  | "SALE_MEDIA";

export const DefaultConfig = {
  app: {
    quickSyncFrequency: 5,
    fullSyncTime: "04:00",
  },
  cloud: {
    privateKey: "",
    publicKey: "",
  },
  email: {
    host: "",
    user: "",
    password: "",
    port: 465,
    useSSL: true,
  },
  fpos: {
    host: "localhost\\SQLEXPRESS",
    user: "sa",
    password: "",
    db: "FuturePOS",
  },
} as Config;

declare global {
  interface Window {
    electron: {
      ipcRenderer: typeof IPCMethods;
    };
  }
}
