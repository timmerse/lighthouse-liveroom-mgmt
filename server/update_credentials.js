'use strict';

const path = require('path');
const config = require('kernel/config');
const fs = require("fs");
const localUser = require('./user/load_user_config').create(config.localUserConfigPath);
const exec = require('child_process').execSync;

const CredentialsPath = './credentials.txt';

// note this command can not run in mac
function doUpdateCredentials() {
  const user = localUser.readUserFromFile();
  const str = `light-house-config_username=${user.username}\nlight-house-config_password=${user.password}`

  if (!fs.existsSync(CredentialsPath)) {
    exec(`touch ${CredentialsPath}`);
  }
  exec(`sed -i '/light-house-config_/d' ${CredentialsPath}`);
  exec(`sed -i '$a ${str}' ${CredentialsPath}`);
}

module.exports = function () {
  try {
    doUpdateCredentials();
  } catch (e) {
    console.log(`update user to ${CredentialsPath} failed, err=${e.stack}`);
  }
}
