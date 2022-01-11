'use strict';

const errors = require('./errors');

const TOKEN_EXPIRED_SECONDS = 30 * 24 * 60 * 60;

// Check the auth by verify(user+token), return the decoded object.
// @remark We store {username, sessionId} in token.
// @throw An error response object.
async function doAuthByUserToken(token, username, secret, jwt) {
  if (!username) throw errors.create(errors.SystemVerifyError, `username required`);

  // Check and get the decoded object.
  const decoded = await doAuthByJwtToken(token, secret, jwt);

  // Check user information.
  // @note The username is not required for compatibility.
  if (username !== decoded.username) {
    console.log(`auth verify, token=${token}, username=${username}, secret=${secret.length}B, decoded=${JSON.stringify(decoded)}`);
    throw errors.create(errors.SystemVerifyError, `invalid username=${username}, token=${token}`);
  }

  return decoded;
}

// Check the auth by verify(token), return the decoded object.
// @remark We store {username, sessionId} in token.
// @throw An error response object.
async function doAuthByJwtToken(token, secret, jwt) {
  if (!secret) throw errors.create(errors.SystemVerifyError, `secret required`);
  if (!token) throw errors.create(errors.SystemVerifyError, `token required`);

  // Verify token first, @see https://www.npmjs.com/package/jsonwebtoken#errors--codes
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, secret, function (err, decoded) {
      if (!err) return resolve(decoded);
      if (err.name === 'TokenExpiredError') throw errors.create(errors.SystemVerifyError, `token expired, token=${token}, expiredAt=${err.expiredAt}, ${err.message}`);
      if (err.name === 'JsonWebTokenError') throw errors.create(errors.SystemVerifyError, `token invalid, token=${token}, ${err.message}`);
      throw errors.create(errors.SystemError, `token verify, token=${token}, ${err.stack}`);
    });
  });

  // Check for v1.
  if (!decoded) throw errors.create(errors.SystemVerifyError, `v required, token=${token}`);
  if (decoded.v !== 1.0) throw errors.create(errors.SystemVerifyError, `v invalid, token=${token}, v=${decoded.v}`);
  if (decoded.v === 1.0) {
    if (!decoded.username) throw errors.create(errors.SystemVerifyError, `username required, token=${token}`);
  }

  return decoded;
}

async function doSignatureToken(username, jwtSecret, jwt) {
  const token = jwt.sign(
    {v: 1.0, username: username},
    jwtSecret, {expiresIn: TOKEN_EXPIRED_SECONDS},
  );
  return token;
}

function create({jwtSecret, jwt}) {
  if (!jwtSecret) throw errors.create(errors.SystemVerifyError, `jwtSecret required`);
  if (!jwt) throw errors.create(errors.SystemVerifyError, `jwt required`);

  return {
    authByUserToken: async function (token, username) {
      if (!jwtSecret) throw errors.create(errors.SystemVerifyError, `config.jwtSecret required`);
      return doAuthByUserToken(token, username, jwtSecret, jwt);
    },
    authByJwtToken: async function (token) {
      if (!jwtSecret) throw errors.create(errors.SystemVerifyError, `config.jwtSecret required`);
      return doAuthByJwtToken(token, jwtSecret, jwt);
    },
    signatureToken: async function (username) {
      if (!jwtSecret) throw errors.create(errors.SystemVerifyError, `config.jwtSecret required`);
      return doSignatureToken(username, jwtSecret, jwt);
    }
  };
}

module.exports = {
  create,
};

