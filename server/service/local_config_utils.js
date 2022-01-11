'use strict';

const fs = require('fs');
const sysPath = require('path');

const defaultConfig = {
  TRTC_TIM_APPID: 'xxxxxxxxxxxxxxxx',
  TRTC_TIM_SECRET: 'xxxxxxxxxxxxxxxx',
  MYSQL_HOST: '127.0.0.1',
  MYSQL_PORT: '3306',
  MYSQL_DB: 'demos',
  MYSQL_USER: 'root',
  REDIS_HOST: 'localhost',
  REDIS_PORT: '6379',
  REDIS_PASSWORD: '',
};

function doCreateLocalConfig(path, config) {
  let str = '';
  Object.keys(config).map((key, index) => {
    str += `${key}=${config[key]}\n`;
  });
  fs.writeFileSync(path, str, {flag: 'w'});
}

function doLoadLocalConfig(path) {
  const content = fs.readFileSync(path, 'utf8');
  const arrays = content.split('\n');
  const config = {};
  arrays.map((value, index) => {
    const rows = value.split('=');
    config[rows[0]] = rows[1];
  });
  return config;
}

function create(path) {
  path = sysPath.resolve(path);
  return {
    loadLocalConfig: function () {
      if (!fs.existsSync(path)) {
        doCreateLocalConfig(path, defaultConfig);
      }
      return doLoadLocalConfig(path);
    },
    saveLocalConfig: function (config) {
      return doCreateLocalConfig(path, config);
    }
  };
}

module.exports = {
  create,
};
