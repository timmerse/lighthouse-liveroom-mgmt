'use strict';

module.exports = {
  jwtSecret: process.env.JWT_SECRET || '12345',
  localConfigPath: process.env.LOCAL_CONFIG_PATH || '/usr/local/lighthouse/softwares/lighthouse-liveroom/conf/env',
  localUserConfigPath: process.env.USER_CONFIG_PATH || '/usr/local/lighthouse/softwares/lighthouse-liveroom-mgmt/conf/user.json'
}
