import fs from 'fs';
import { join } from 'path';

import CryptoJS from 'crypto-js';
import { BrowserWindow } from 'electron';
import getMAC from 'getmac';
import { Sequelize } from 'sequelize';
import SequelizeAuto from 'sequelize-auto';

const decryptConfig = (config) => {
  return {
    ...config,
    API: {
      ...config.API,
      private: CryptoJS.AES.decrypt(config.API.private, getMAC()).toString(CryptoJS.enc.Utf8)
    },
    FPOS: {
      ...config.FPOS,
      password: CryptoJS.AES.decrypt(config.FPOS.password, getMAC()).toString(CryptoJS.enc.Utf8)
    }
  };
};

const encryptConfig = (config) => {
  return {
    ...config,
    API: {
      ...config.API,
      private: CryptoJS.AES.encrypt(config.API.private, getMAC()).toString()
    },
    FPOS: {
      ...config.FPOS,
      password: CryptoJS.AES.encrypt(config.FPOS.password, getMAC()).toString()
    }
  };
};

const fpos = {
  connected: false,
  config: {},
  db: null,
  async connect(config, callback = null) {
    this.connected = false;
    this.config = config;
    this.db = new Sequelize(this.config.database, this.config.user, this.config.password, {
      dialect: 'mssql',
      host: this.config.host.split('\\')[0],
      logging: false,
      dialectOptions: {
        options: {
          instanceName: this.config.host.split('\\').length > 1 ? this.config.host.split('\\')[1] : '',
          encrypt: false
        }
      }
    });
    try {
      await this.db.authenticate();
      const autoOptions = {
        caseModel: 'c',
        caseFile: 'c',
        directory: './models',
        singularize: true,
        tables: ['Department', 'Item', 'Sale']
      };
      const auto = new SequelizeAuto(this.db, null, null, autoOptions);
      const data = await auto.run();
      const { initModels } = require('../models/init-models');
      const data = initModels(this.db);
      console.log(data);
      callback(config, true);
    } catch (err) {
      sendError({
        title: err.toString().split(':')[0],
        body: err.toString().split(':')[1]
      });
      callback(config, false);
    }
  }
};

const sendError = (msg) => {
  BrowserWindow.getFocusedWindow().webContents.send('error', msg);
};

export default {
  getConfig: async (event) => {
    const filepath = join(__dirname, 'config.json');
    let config = {};
    try {
      config = JSON.parse(await fs.promises.readFile(filepath));
    } catch (err) {
      await fs.promises.writeFile(
        filepath,
        JSON.stringify(
          encryptConfig({
            API: {
              public: '',
              private: CryptoJS.AES.encrypt('', getMAC()).toString()
            },
            FPOS: {
              host: '',
              user: '',
              password: CryptoJS.AES.encrypt('', getMAC()).toString(),
              database: ''
            }
          }),
          null,
          4
        )
      );
      config = JSON.parse(await fs.promises.readFile(filepath));
    }
    config = decryptConfig(config);
    if (fpos.db && fpos.connected) {
      event.sender.send('getConfig', { config, status: fpos.connected });
    } else {
      fpos.connect(config.FPOS, (fposConfig, status) => event.sender.send('getConfig', { config, status }));
    }
  },
  setConfig: async (event, config) => {
    const filepath = join(__dirname, 'config.json');
    await fs.promises.writeFile(filepath, JSON.stringify(encryptConfig(config), null, 4));
    let newConfig = JSON.parse(await fs.promises.readFile(filepath));
    newConfig = decryptConfig(newConfig);
    fpos.connect(newConfig.FPOS, (config, status) => event.sender.send('setConfig', { config: newConfig, status }));
  }
};
