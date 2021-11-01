import fs from 'fs';
import { join } from 'path';

import CryptoJS from 'crypto-js';
import getMAC from 'getmac';

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
  config: null,
  function connect (config = {}) {

  }
}

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
    event.sender.send('getConfig', config);
  },
  setConfig: async (event, config) => {
    const filepath = join(__dirname, 'config.json');
    await fs.promises.writeFile(filepath, JSON.stringify(encryptConfig(config), null, 4));
    let newConfig = JSON.parse(await fs.promises.readFile(filepath));
    newConfig = decryptConfig(newConfig);
    console.log(newConfig);
    event.sender.send('setConfig', newConfig);
  }
};
