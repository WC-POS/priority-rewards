/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { BrowserWindow, app, ipcMain, shell } from 'electron';
import {
  connect,
  decryptConfig,
  disconnect,
  getConfig,
  getDepartments,
  getItem,
  getItems,
  getStatus,
  resolveHtmlPath,
  writeConfig,
} from './util';

import MenuBuilder from './menu';
import { autoUpdater } from 'electron-updater';
import { getConnection } from 'typeorm';
import log from 'electron-log';
import path from 'path';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });

ipcMain.handle('get-config', async () => {
  const config = await getConfig();
  return config;
});

ipcMain.handle('get-item', async (_, id: string) => {
  return getItem(id);
});

ipcMain.handle('get-items', async () => {
  return getItems();
});

ipcMain.handle('get-departments', async () => {
  return getDepartments();
});

ipcMain.handle('get-status', () => getStatus());

ipcMain.handle('set-config', async (_, config) => {
  await writeConfig(config);
  await disconnect();
  const decryptedConfig = decryptConfig(config);
  await connect(decryptedConfig);
  return decryptedConfig;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minHeight: 300,
    minWidth: 420,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    getConfig()
      .then((config) => {
        connect(config);
      })
      .catch((err) => {
        console.log(err);
      });
    if (isDevelopment) {
      mainWindow?.webContents.executeJavaScript(
        'localStorage.setItem("env", "development")',
        true
      );
    } else {
      mainWindow?.webContents.executeJavaScript(
        'localStorage.setItem("env", "production")',
        true
      );
    }
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (getConnection().isConnected) {
    getConnection().close();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
