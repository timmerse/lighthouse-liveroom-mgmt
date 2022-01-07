'use strict';

const config = require('kernel/config');
const localUser = require('./user/load_user_config').create(config.localUserConfigPath);
const exec = require('child_process').execSync;

const CredentialsPath = '~/credentials.txt';

// note this command can not run in mac
function doUpdateCredentials() {
  const user = localUser.readUserFromFile();
  exec(`[ ! -f ${CredentialsPath} ] && echo '#Credentials' >> ${CredentialsPath} || echo skip create`);
  exec(`sed -i '/lighthouse-config_/d' ${CredentialsPath}`);
  exec(`sed -i '$a lighthouse-config_username=${user.username}' ${CredentialsPath}`);
  exec(`sed -i '$a lighthouse-config_password=${user.password}' ${CredentialsPath}`);
}

module.exports = function () {
  try {
    doUpdateCredentials();
  } catch (e) {
    console.log(`update user to ${CredentialsPath} failed, err=${e.stack}`);
  }
}
