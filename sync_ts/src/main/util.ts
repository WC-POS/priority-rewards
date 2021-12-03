import { createConnection, getConnection } from 'typeorm';

import { BrowserWindow } from 'electron';
import CryptoJS from 'crypto-js';
import { SettingsConfig } from 'types';
import { URL } from 'url';
import fs from 'fs';
import getMAC from 'getmac';
import { getUnixTime } from 'date-fns';
import { log } from 'electron-log';
import path from 'path';

// eslint-disable-next-line import/no-mutable-exports
export let resolveHtmlPath: (htmlFileName: string) => string;

export interface ErrorMsg {
  createdAt: number;
  title: string;
  body: string;
  error: Error;
}

export function buildError(
  title: string,
  body: string,
  error: Error
): ErrorMsg {
  return {
    createdAt: getUnixTime(new Date()),
    title,
    body,
    error,
  };
}

export function sendConnect(status: boolean) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send('connect', status);
  }
}

export function sendSaveConfig(config: SettingsConfig) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send('save-config', config);
  }
}

export function sendError(error: ErrorMsg) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send('error', error);
  }
}

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const defaultConfig: SettingsConfig = {
  API: {
    publicKey: '',
    privateKey: '',
  },
  FPOS: {
    host: '',
    user: '',
    password: '',
    database: '',
  },
  LOG: {
    database: '',
  },
  encrypted: false,
};

export const decryptConfig: (config: SettingsConfig) => SettingsConfig = (
  config: SettingsConfig
) => {
  if (!config.encrypted) return config;
  return {
    ...config,
    API: {
      ...config.API,
      privateKey: CryptoJS.AES.decrypt(
        config.API.privateKey,
        getMAC()
      ).toString(CryptoJS.enc.Utf8),
    },
    FPOS: {
      ...config.FPOS,
      password: CryptoJS.AES.decrypt(config.FPOS.password, getMAC()).toString(
        CryptoJS.enc.Utf8
      ),
    },
    encrypted: false,
  };
};

export const encryptConfig: (config: SettingsConfig) => SettingsConfig = (
  config: SettingsConfig
) => {
  if (config.encrypted) return config;
  return {
    ...config,
    API: {
      ...config.API,
      privateKey: CryptoJS.AES.encrypt(
        config.API.privateKey,
        getMAC()
      ).toString(),
    },
    FPOS: {
      ...config.FPOS,
      password: CryptoJS.AES.encrypt(config.FPOS.password, getMAC()).toString(),
    },
    encrypted: true,
  };
};

export const writeConfig = async (config: SettingsConfig) => {
  const filepath = path.join(__dirname, 'config.json');
  const encryptedConfig = encryptConfig(config);
  delete encryptedConfig.encrypted;
  await fs.promises.writeFile(
    filepath,
    JSON.stringify(encryptedConfig, null, 4)
  );
  sendSaveConfig(decryptConfig(config));
};

export const getConfig = async () => {
  const filepath = path.join(__dirname, 'config.json');
  try {
    const config = {
      ...JSON.parse(await (await fs.promises.readFile(filepath)).toString()),
      encrypted: true,
    };
    return decryptConfig(config);
  } catch (err) {
    await writeConfig({ ...defaultConfig });
    return { ...defaultConfig };
  }
};

export const getStatus = () => {
  const status = getConnection().isConnected;
  sendConnect(status);
  return status;
};

export const disconnect = async () => {
  try {
    const connection = getConnection();
    if (connection.isConnected) {
      await getConnection().close();
      sendConnect(false);
    }
  } catch (err) {
    log(err);
  }
};

export const connect = async (config: SettingsConfig) => {
  try {
    await disconnect();
    const decryptedConfig = decryptConfig(config);
    const entityDirRule = path
      .join(__dirname, 'models', 'FPOS', '*.ts')
      .toString();
    await createConnection({
      type: 'mssql',
      host: decryptedConfig.FPOS.host,
      username: decryptedConfig.FPOS.user,
      password: decryptedConfig.FPOS.password,
      database: decryptedConfig.FPOS.database,
      entities: [entityDirRule],
      synchronize: false,
      extra: {
        encrypt: false,
        instanceName: decryptedConfig.FPOS.host.split('\\')[1],
      },
    });
  } catch (err) {
    log(err);
    sendError(
      buildError(
        'Could not connect to FPOS',
        'Please confirm that the DB credentials provided are correct.',
        err as Error
      )
    );
  }
  return getStatus();
};
