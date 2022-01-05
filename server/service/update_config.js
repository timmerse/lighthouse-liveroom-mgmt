'use strict';
const errors = require('kernel/errors');
const utils = require('kernel/utils');
const config = require('kernel/config');
const jwt = require('jsonwebtoken');
const auth = require('kernel/auth').create({jwtSecret: config.jwtSecret, jwt})
const localConfig = require("./local_config_utils").create(config.localConfigPath);

exports.main_handler = async (ctx) => {
  const q = utils.parseKoaRequest(ctx);
  if (!q.username) throw errors.create(errors.SystemVerifyError, `username required`);
  if (!q.token) throw errors.create(errors.SystemVerifyError, `token required, username=${q.username}`);
  if (!q.sdkAppId) throw errors.create(errors.SystemVerifyError, `sdkAppId required`);
  if (!q.sdkSecret) throw errors.create(errors.SystemVerifyError, `sdkSecret required, sdkAppId=${q.sdkAppId}`);

  await auth.authByUserToken(q.token, q.username);

  const oldConfig = localConfig.loadLocalConfig();
  const newConfig = Object.assign({}, oldConfig);

  newConfig.TRTC_TIM_APPID = q.sdkAppId;
  newConfig.TRTC_TIM_SECRET = q.sdkSecret;

  console.log(`update-config, oldConfig=${JSON.stringify(oldConfig)}, newConfig=${JSON.stringify(newConfig)}`);

  localConfig.saveLocalConfig(newConfig);

  return errors.data({}, `update config ok`);
};
