const koa = require('koa');
const logger = require('pino')()
const app = new koa();
const { koaBody } = require('koa-body');
require('koa-qs')(app, 'extended')
const router = require('./routes');

const env = process.env.NODE_ENV || 'dev';
const Config = require('./config')[env];
const { FileHelper } = require('./modules');

app.use(koaBody());

app.context.config = Config;
app.context.logger = logger;
app.context.disposableDomains = FileHelper.loadConfFile(Config.paths.disposable_domain_db_path);
app.context.trustedDomains = FileHelper.loadConfFile(Config.paths.trusted_domain_db_path);

// Error handling middleware
app.use(async (ctx, next) => {
	try {
		ctx.set('ngrok-skip-browser-warning', 'true');
		ctx.set('Access-Control-Allow-Origin', '*');
		ctx.set('Access-Control-Allow-Methods', '*');
		ctx.set('Access-Control-Allow-Headers', '*');
		await next();
	} catch (err) {
		console.log('Process.Error', err);
		ctx.status = err.status || 500;
		ctx.body = err.message;
		ctx.app.emit('error', err, ctx);
	}
});

// x-response-time
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	ctx.set('x-rt', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;

	logger.info(`${ctx.status} ${ctx.method} ${ctx.url} - ${ms} ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());
// server listining
app.listen(Config.app.port, () => console.log(`QS (Quick Service) v1 API server started on port ${Config.app.port}`));
