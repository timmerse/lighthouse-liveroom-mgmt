'use strict';

const errors = require('kernel/errors');

function create(router) {
  router.all('/base/v1/service/:api', async (ctx) => {
    try {
      let res = null;
      if (ctx.params.api === 'restart_service') {
        res = await require('./restart_service').main_handler(ctx);
      } else if (ctx.params.api === 'update_config') {
        res = await require('./update_config').main_handler(ctx);
      } else if (ctx.params.api === 'detail_config') {
        res = await require('./detail_config').main_handler(ctx);
      } else {
        throw new Error(`invalid api ${ctx.params.api}`);
      }
      ctx.body = res;
    } catch (err) {
      console.log(`service-err request ${JSON.stringify(ctx.request)} err ${errors.format(err)}`);
      ctx.body = errors.asResponse(err);
    }
  });
}

module.exports = {
  create,
};
