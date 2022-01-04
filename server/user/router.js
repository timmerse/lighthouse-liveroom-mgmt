'use strict';

const errors = require('kernel/errors');

function create(router) {
  router.all('/base/v1/user/:api', async (ctx) => {
    try {
      let res = null;
      if (ctx.params.api === 'login') {
        res = await require('./login').main_handler(ctx);
      } else {
        throw new Error(`invalid api ${ctx.params.api}`);
      }
      ctx.body = res;
    } catch (err) {
      console.log(`user-err request ${JSON.stringify(ctx.request)} err ${errors.format(err)}`);
      ctx.body = errors.asResponse(err);
    }
  });
}

module.exports = {
  create,
};
