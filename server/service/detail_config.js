'use strict';
const errors = require('kernel/errors');
const utils = require('kernel/utils');
const config = require('kernel/config');
const jwt = require('jsonwebtoken');
const auth = require('kernel/auth').create({jwtSecret: config.jwtSecret, jwt});
const localConfig = require("./local_config_utils").create(config.localConfigPath);

exports.main_handler = async (ctx) => {
  const q = utils.parseKoaRequest(ctx);
  if (!q.username) throw errors.create(errors.SystemVerifyError, `username required`);
  if (!q.token) throw errors.create(errors.SystemVerifyError, `token required, username=${q.username}`);

  await auth.authByUserToken(q.token, q.username);
  const config = localConfig.loadLocalConfig();
  return errors.data(config, `detail config ok`);
};
