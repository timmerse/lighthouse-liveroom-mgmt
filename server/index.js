'use strict';

const dotenv = require('dotenv');
// Default to local development env.
process.env.STAGE = process.env.STAGE || 'local';
// Try to read .env manually, for directly run node.
dotenv.config({path: `.env.${process.env.STAGE}`});

const Koa = require('koa');
const Router = require('koa-router');
const Cors = require('koa2-cors');
const BodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(Cors());

app.use(BodyParser());

const router = new Router();
app.use(router.routes());

// Run all modules in one nodejs server.
require('./user/router').create(router);
require('./service/router').create(router);

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});

