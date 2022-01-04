'use strict';

const errors = require('kernel/errors');

function create(router) {
  router.all('/base/v1/configs/:api', async (ctx) => {
    try {
      let res = null;
      if (ctx.params.api === 'update_config') {
        res = await require('./update_config').main_handler(ctx);
      } else if (ctx.params.api === 'detail_config') {
        res = await require('./detail_config').main_handler(ctx);
      } else {
        throw new Error(`invalid api ${ctx.params.api}`);
      }
      ctx.body = res;
    } catch (err) {
      console.log(`configs-err request ${JSON.stringify(ctx.request)} err ${errors.format(err)}`);
      ctx.body = errors.asResponse(err);
    }
  });
}

module.exports = {
  create,
};
