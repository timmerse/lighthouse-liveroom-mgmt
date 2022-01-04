'use strict';
const errors = require('kernel/errors');
const utils = require('kernel/utils');
const config = require('kernel/config');
const jwt = require('jsonwebtoken');
const auth = require('kernel/auth').create({jwtSecret: config.jwtSecret, jwt})
const accessUser = require('./load_user_config').create(config.localUserConfigPath).readUserFromFile();

exports.main_handler = async (ctx) => {
  const q = utils.parseKoaRequest(ctx);
  if (!q.username) throw errors.create(errors.SystemVerifyError, `username required`);
  if (!q.password) throw errors.create(errors.SystemVerifyError, `password required, username=${q.username}`);
  if (q.username !== accessUser.username) throw errors.create(errors.SystemVerifyError, `username=${q.username} invalid`);
  if (q.password !== accessUser.password) throw errors.create(errors.SystemVerifyError, `password invalid`);

  const token = await auth.signatureToken(q.username);

  return errors.data({
    username: q.username,
    token: token
  }, `login ok`);
};
