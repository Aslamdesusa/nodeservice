const Router = require('@koa/router');
const r = new Router();

let Controllers = require('../controllers');

r.get('/api/v1/email-verify', async (ctx, _next) => {
	let ctr = new Controllers.EmailService(ctx, _next);
	await ctr.emailVerify()
})

module.exports = r;
