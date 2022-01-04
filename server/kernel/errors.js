'use strict';

/*
Create a error response for SCF to return, for example:
    const errors = require('js-core/errors');
    exports.main_handler = async (event, context) => {
        return errors.create(errors.UserCodeInvalid, 'invalid params');
    };
*/
function create(code, msg, errs) {
  let name = 'Error';
  errs = errs || module.exports;
  Object.keys(module.exports).map((k) => {
    if (module.exports[k] === code) {
      name = k;
    }
  });

  return {
    errorCode: code,
    codeStr: name,
    errorMessage: `${name}(${code}): ${msg}`,
    errorStack: `${new Error().stack}`,
  };
}

/*
Create a success response for SCE to return, for example:
    const errors = require('js-core/errors');
    exports.main_handler = async (event, context) => {
        return errors.data();
        return errors.data({sessionId: 'xxx'});
        return errors.data({sessionId: 'xxx'}, 'It works!');
        return errors.data({sessionId: 'xxx'}, 'It works!', 0);
    };
 */
function data(data, msg, code) {
  const r = {
    errorCode: code || module.exports.Success,
    errorMessage: msg || '',
  };

  if (data) {
    r.data = data;
  }

  return r;
}

/*
Parse err to error response object, for example:
    const errors = require('./errors');
    exports.main_handler = async (event, context) => {
        try {
            const data = yourFunction();
            return errors.data(data);
        } catch(err) {
            return errors.asResponse(err);
        }
    };
 */
function asResponse(err) {
  // The err or data is create by this module, return it directly.
  if (err instanceof Object && err.errorCode !== undefined) {
    return err;
  }

  // A standard Error object.
  if (err instanceof Error) {
    return create(module.exports.SystemError, `${err.stack}`);
  }

  // For error string.
  if (typeof (err) === 'string') {
    return create(module.exports.SystemError, err);
  }

  // Let SCF to handle the error.
  throw err;
}


// Format err in json, inline string.
function format(err) {
  return JSON.stringify(asResponse(err));
}

module.exports = {
  create,
  data,
  asResponse,
  format,
  // Error codes defines.
  Success: 0,
  SystemVerifyError: 98,
  SystemError: 99,
};

